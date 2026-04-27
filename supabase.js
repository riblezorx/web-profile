// ============================================================
// KONFIGURASI SUPABASE (GLOBAL)
// Dipakai oleh index.html dan admin-index.html
// ============================================================
const SUPA_URL = 'https://qzlznykmliloqvuwzznw.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6bHpueWttbGlsb3F2dXd6em53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwMTU5MTAsImV4cCI6MjA5MjU5MTkxMH0.xZNDJcgw1DFXou_crncanXcDbJdZwR477ITdftYViSk';

// Helper: Memasang header. Jika admin login, gunakan Token Admin. Jika publik, gunakan Anon Key.
function getHeaders() {
  const token = localStorage.getItem('supa_token');
  return {
    'apikey': SUPA_KEY,
    'Authorization': 'Bearer ' + (token ? token : SUPA_KEY),
    'Content-Type': 'application/json'
  };
}

// --- FUNGSI AUTENTIKASI ---
async function sbLogin(email, password) {
  const r = await fetch(`${SUPA_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { 'apikey': SUPA_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error_description || 'Login gagal');
  
  // Simpan token ke browser agar tidak perlu login terus menerus
  localStorage.setItem('supa_token', data.access_token);
  return data;
}

function sbLogout() {
  localStorage.removeItem('supa_token');
}

// --- FUNGSI DATABASE ---
async function sbGet(t, q = '') {
  const r = await fetch(`${SUPA_URL}/rest/v1/${t}?${q}`, { headers: getHeaders() });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

async function sbPost(t, b) {
  const r = await fetch(`${SUPA_URL}/rest/v1/${t}`, {
    method: 'POST',
    headers: { ...getHeaders(), 'Prefer': 'return=representation' },
    body: JSON.stringify(b)
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

async function sbPatch(t, id, b) {
  const r = await fetch(`${SUPA_URL}/rest/v1/${t}?id=eq.${id}`, {
    method: 'PATCH',
    headers: { ...getHeaders(), 'Prefer': 'return=representation' },
    body: JSON.stringify(b)
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

async function sbDelete(t, id) {
  const r = await fetch(`${SUPA_URL}/rest/v1/${t}?id=eq.${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  if (!r.ok) throw new Error(await r.text());
}

async function getSiteContent(k, fb = '') {
  try {
    const d = await sbGet('site_content', `key=eq.${k}&select=value`);
    return d && d[0] ? d[0].value : fb;
  } catch {
    return fb;
  }
}

async function upsertContent(k, v) {
  const ex = await sbGet('site_content', `key=eq.${k}`);
  if (ex && ex.length > 0) {
    await fetch(`${SUPA_URL}/rest/v1/site_content?key=eq.${k}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ value: v })
    });
  } else {
    await sbPost('site_content', { key: k, value: v });
  }
}