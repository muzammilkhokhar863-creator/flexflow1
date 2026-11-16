const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  || `http://${window.location.hostname}:4000`;

/** Send requests to the FixFlow backend and include its login cookie. */
export async function apiRequest(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      credentials: 'include',
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error('Can’t reach the FixFlow server. Start the backend and try again.');
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || 'Something went wrong. Please try again.');
    error.status = response.status;
    throw error;
  }
  return data;
}
