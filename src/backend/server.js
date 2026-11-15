import { createServer } from 'node:http';
import { randomBytes, randomUUID, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scrypt = promisify(scryptCallback);
const PORT = Number(process.env.PORT || 4000);
const HOST = process.env.HOST || '127.0.0.1';
const SESSION_COOKIE = 'fixflow_session';
const SESSION_LENGTH = 7 * 24 * 60 * 60 * 1000;
const USERS_FILE = process.env.FIXFLOW_USERS_FILE
  ? resolve(process.env.FIXFLOW_USERS_FILE)
  : join(dirname(fileURLToPath(import.meta.url)), 'data', 'users.json');
const SESSION_SECURE = process.env.NODE_ENV === 'production';
const defaultOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];
const allowedOrigins = new Set(
  (process.env.FIXFLOW_ALLOWED_ORIGINS || defaultOrigins.join(','))
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
);

const sessions = new Map();
let users = await readUsers();
const dummyPasswordHash = await hashPassword(randomBytes(24).toString('hex'));
await addConfiguredManager();

function sendJson(response, status, data, extraHeaders = {}) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...extraHeaders,
  });
  response.end(JSON.stringify(data));
}

function addCorsHeaders(request, response) {
  const origin = request.headers.origin;
  response.setHeader('Vary', 'Origin');
  if (origin && allowedOrigins.has(origin)) {
    response.setHeader('Access-Control-Allow-Origin', origin);
    response.setHeader('Access-Control-Allow-Credentials', 'true');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
}

async function readJson(request) {
  const chunks = [];
  let size = 0;

  for await (const chunk of request) {
    size += chunk.length;
    if (size > 16_000) {
      const error = new Error('Request is too large.');
      error.status = 413;
      throw error;
    }
    chunks.push(chunk);
  }

  try {
    const body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      const error = new Error('Please send a JSON object.');
      error.status = 400;
      throw error;
    }
    return body;
  } catch (error) {
    if (error.status) throw error;
    const parseError = new Error('Please send valid JSON.');
    parseError.status = 400;
    throw parseError;
  }
}

function normalizeEmail(email) {
  return typeof email === 'string' ? email.trim().toLowerCase() : '';
}

function validEmail(email) {
  return email.length <= 254 && /^\S+@\S+\.\S+$/.test(email);
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

function cookieValue(request, cookieName) {
  const cookieHeader = request.headers.cookie || '';
  const cookie = cookieHeader.split(';').map((item) => item.trim())
    .find((item) => item.startsWith(`${cookieName}=`));
  return cookie ? cookie.slice(cookieName.length + 1) : '';
}

function sessionCookie(value, maxAge) {
  const secure = SESSION_SECURE ? '; Secure' : '';
  return `${SESSION_COOKIE}=${value}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAge}${secure}`;
}

function createSession(user) {
  const id = randomBytes(32).toString('base64url');
  sessions.set(id, { userId: user.id, expiresAt: Date.now() + SESSION_LENGTH });
  return id;
}

function sessionUser(request) {
  const id = cookieValue(request, SESSION_COOKIE);
  const session = sessions.get(id);
  if (!session) return null;
  if (session.expiresAt <= Date.now()) {
    sessions.delete(id);
    return null;
  }
  return users.find((user) => user.id === session.userId) || null;
}

function requireAccountFields({ name, email, password }, includeName = false) {
  const normalizedEmail = normalizeEmail(email);
  if (!validEmail(normalizedEmail)) {
    const error = new Error('Enter a valid email address.');
    error.status = 400;
    throw error;
  }
  if (typeof password !== 'string' || password.length < 8 || password.length > 128) {
    const error = new Error('Password must be between 8 and 128 characters.');
    error.status = 400;
    throw error;
  }
  if (includeName && (typeof name !== 'string' || !name.trim() || name.trim().length > 100)) {
    const error = new Error('Enter a name of up to 100 characters.');
    error.status = 400;
    throw error;
  }
  return normalizedEmail;
}

async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = await scrypt(password, salt, 64);
  return `${salt}:${hash.toString('hex')}`;
}

async function passwordMatches(password, savedHash) {
  const [salt, savedKey] = (savedHash || '').split(':');
  if (!salt || !savedKey) return false;
  const savedBuffer = Buffer.from(savedKey, 'hex');
  const submittedBuffer = await scrypt(password, salt, 64);
  return savedBuffer.length === submittedBuffer.length
    && timingSafeEqual(savedBuffer, submittedBuffer);
}

async function readUsers() {
  try {
    const contents = await readFile(USERS_FILE, 'utf8');
    const parsed = JSON.parse(contents);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

async function saveUsers() {
  await mkdir(dirname(USERS_FILE), { recursive: true });
  await writeFile(USERS_FILE, `${JSON.stringify(users, null, 2)}\n`, 'utf8');
}

async function addConfiguredManager() {
  const email = normalizeEmail(process.env.FIXFLOW_MANAGER_EMAIL);
  const password = process.env.FIXFLOW_MANAGER_PASSWORD;
  if (!email && !password) return;
  if (!email || !password) {
    throw new Error('Set both FIXFLOW_MANAGER_EMAIL and FIXFLOW_MANAGER_PASSWORD to enable the manager account.');
  }
  if (!validEmail(email) || password.length < 8 || password.length > 128) {
    throw new Error('The configured manager account needs a valid email and a password of 8 to 128 characters.');
  }

  const existingUser = users.find((user) => user.email === email);
  if (existingUser && existingUser.role !== 'manager') {
    throw new Error('The configured manager email already belongs to a customer account. Choose another email.');
  }
  const manager = {
    id: existingUser?.id || randomUUID(),
    name: process.env.FIXFLOW_MANAGER_NAME?.trim() || 'FixFlow Manager',
    email,
    passwordHash: await hashPassword(password),
    role: 'manager',
  };
  if (existingUser) users = users.map((user) => user.id === existingUser.id ? manager : user);
  else users.push(manager);
  await saveUsers();
}

async function handleRequest(request, response) {
  addCorsHeaders(request, response);
  if (request.method === 'OPTIONS') {
    response.writeHead(204);
    response.end();
    return;
  }

  const path = new URL(request.url, `http://${request.headers.host || 'localhost'}`).pathname;

  if (request.method === 'GET' && path === '/api/health') {
    sendJson(response, 200, { status: 'ok', service: 'FixFlow API' });
    return;
  }

  if (request.method === 'POST' && path === '/api/auth/register') {
    const body = await readJson(request);
    const email = requireAccountFields(body, true);
    if (users.some((user) => user.email === email)) {
      sendJson(response, 409, { message: 'An account with this email already exists.' });
      return;
    }
    const user = {
      id: randomUUID(),
      name: body.name.trim(),
      email,
      passwordHash: await hashPassword(body.password),
      role: 'customer',
    };
    users.push(user);
    await saveUsers();
    const sessionId = createSession(user);
    sendJson(response, 201, { user: publicUser(user) }, {
      'Set-Cookie': sessionCookie(sessionId, Math.floor(SESSION_LENGTH / 1000)),
    });
    return;
  }

  if (request.method === 'POST' && path === '/api/auth/login') {
    const body = await readJson(request);
    const email = normalizeEmail(body.email);
    const password = typeof body.password === 'string' ? body.password : '';
    const user = users.find((account) => account.email === email);
    const passwordIsTooLong = password.length > 128;
    const passwordToCheck = passwordIsTooLong ? 'invalid-password' : password;
    const matches = await passwordMatches(passwordToCheck, user?.passwordHash || dummyPasswordHash);
    if (!user || passwordIsTooLong || !matches) {
      sendJson(response, 401, { message: 'Email or password is incorrect.' });
      return;
    }
    const sessionId = createSession(user);
    sendJson(response, 200, { user: publicUser(user) }, {
      'Set-Cookie': sessionCookie(sessionId, Math.floor(SESSION_LENGTH / 1000)),
    });
    return;
  }

  if (request.method === 'GET' && path === '/api/auth/me') {
    const user = sessionUser(request);
    if (!user) {
      sendJson(response, 401, { message: 'Please log in to continue.' });
      return;
    }
    sendJson(response, 200, { user: publicUser(user) });
    return;
  }

  if (request.method === 'POST' && path === '/api/auth/logout') {
    const sessionId = cookieValue(request, SESSION_COOKIE);
    if (sessionId) sessions.delete(sessionId);
    sendJson(response, 200, { message: 'You have been signed out.' }, {
      'Set-Cookie': sessionCookie('', 0),
    });
    return;
  }

  sendJson(response, 404, { message: 'This API route does not exist.' });
}

const server = createServer((request, response) => {
  handleRequest(request, response).catch((error) => {
    const status = error.status || 500;
    const message = status === 500 ? 'The server could not complete this request.' : error.message;
    sendJson(response, status, { message });
    if (status === 500) console.error(error);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`FixFlow API is running at http://${HOST}:${PORT}`);
  console.log(`Health check: http://${HOST}:${PORT}/api/health`);
  console.log(process.env.FIXFLOW_MANAGER_EMAIL
    ? `Manager account enabled for ${normalizeEmail(process.env.FIXFLOW_MANAGER_EMAIL)}`
    : 'No manager account configured. Set FIXFLOW_MANAGER_EMAIL and FIXFLOW_MANAGER_PASSWORD to add one.');
});
