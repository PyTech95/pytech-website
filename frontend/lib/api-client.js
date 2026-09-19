export function apiUrl(path) {
  const base = process.env.REACT_APP_BACKEND_URL;
  if (!base) throw new Error('REACT_APP_BACKEND_URL is not configured');
  return `${base.replace(/\/$/, '')}${path}`;
}