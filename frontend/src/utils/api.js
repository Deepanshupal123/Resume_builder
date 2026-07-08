export const API_BASE =
  process.env.REACT_APP_API_URL ||
  (typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : 'https://resume-builder-7ngc.onrender.com');

export async function apiFetch(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers = Object.assign({ 'Content-Type': 'application/json' }, options.headers || {});

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const opts = Object.assign({}, options, { headers });
  return fetch(url, opts);
}
