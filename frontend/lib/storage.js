// Emergent object storage helper (Node runtime). Ported from the Python playbook.
// Stores files (e.g. resumes) and serves them back via our own API.

const STORAGE_BASE = (process.env.INTEGRATION_PROXY_URL || '').trim() || 'https://integrations.emergentagent.com';
const STORAGE_URL = STORAGE_BASE.replace(/\/+$/, '') + '/objstore/api/v1/storage';
export const APP_NAME = 'pytech-digital';

let storageKey = null;

async function initStorage(force = false) {
  if (storageKey && !force) return storageKey;
  const res = await fetch(`${STORAGE_URL}/init`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emergent_key: process.env.EMERGENT_LLM_KEY }),
  });
  if (!res.ok) throw new Error(`storage init failed: ${res.status}`);
  const j = await res.json();
  storageKey = j.storage_key;
  return storageKey;
}

export async function putObject(path, buffer, contentType) {
  let key = await initStorage();
  const doPut = (k) => fetch(`${STORAGE_URL}/objects/${path}`, {
    method: 'PUT',
    headers: { 'X-Storage-Key': k, 'Content-Type': contentType || 'application/octet-stream' },
    body: buffer,
  });
  let res = await doPut(key);
  if (res.status === 404) { key = await initStorage(true); res = await doPut(key); }
  if (!res.ok) throw new Error(`storage put failed: ${res.status}`);
  return res.json();
}

export async function getObject(path) {
  let key = await initStorage();
  const doGet = (k) => fetch(`${STORAGE_URL}/objects/${path}`, { headers: { 'X-Storage-Key': k } });
  let res = await doGet(key);
  if (res.status === 404) { key = await initStorage(true); res = await doGet(key); }
  if (!res.ok) throw new Error(`storage get failed: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  return { buffer, contentType: res.headers.get('content-type') || 'application/octet-stream' };
}
