import { spawn } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const sourceFolder = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(sourceFolder, '..');
const apiPort = Number(process.env.PORT || 4000);
const apiUrl = `http://127.0.0.1:${apiPort}`;

let apiProcess;
let viteServer;
let stopping = false;

async function apiIsRunning() {
  try {
    const response = await fetch(`${apiUrl}/api/health`);
    return response.ok;
  } catch {
    return false;
  }
}

async function waitForApi() {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    if (await apiIsRunning()) return;
    if (apiProcess.exitCode !== null) throw new Error('The API server stopped during startup.');
    await new Promise((resolveWait) => setTimeout(resolveWait, 500));
  }
  throw new Error('The API server did not become ready.');
}

async function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  process.exitCode = code;

  if (viteServer) await viteServer.close();
  if (apiProcess && apiProcess.exitCode === null) {
    apiProcess.kill();
    await new Promise((resolveExit) => apiProcess.once('exit', resolveExit));
  }
}

process.once('SIGINT', () => void stop(0));
process.once('SIGTERM', () => void stop(0));

try {
  if (!(await apiIsRunning())) {
    apiProcess = spawn(process.execPath, ['src/backend/server.js'], {
      cwd: projectRoot,
      env: process.env,
      stdio: 'inherit',
    });
    apiProcess.once('exit', (code) => {
      if (!stopping) {
        console.error('The API server stopped unexpectedly.');
        void stop(code || 1);
      }
    });
    await waitForApi();
  } else {
    console.log('Using the existing FixFlow API server.');
  }

  viteServer = await createServer({
    root: projectRoot,
    server: { host: '127.0.0.1', port: 5173, strictPort: true },
  });
  await viteServer.listen();
  viteServer.printUrls();
  console.log(`FixFlow API is ready at ${apiUrl}/api/health`);
} catch (error) {
  console.error(error.message);
  await stop(1);
}
