// Shared helpers
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
const clean = s => String(s ?? '').replace(/ /g, ' ').replace(/\s+/g, ' ').trim();

// Arabic normalisation for fuzzy matching of areas
function normAr(s) {
  return clean(s).toLowerCase()
    .replace(/[ً-ْـ]/g, '')       // tashkeel + tatweel
    .replace(/[أإآٱ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي')
    .replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
    .replace(/[^\p{L}\p{N} ]/gu, ' ').replace(/\s+/g, ' ').trim();
}

// Egyptian mobile numbers: 01xxxxxxxxx
function findPhones(...texts) {
  const out = [];
  for (const t of texts) {
    if (!t) continue;
    const s = String(t).replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[\s\-()]/g, '');
    for (const m of s.matchAll(/(?:\+?20|0020)?(1[0125]\d{8})/g)) {
      const p = '0' + m[1];
      if (!out.includes(p)) out.push(p);
    }
  }
  return out;
}

const money = n => {
  const v = Number(String(n ?? '').replace(/[^\d.-]/g, ''));
  return isFinite(v) ? v.toLocaleString('en-US', { maximumFractionDigits: 2 }) : String(n ?? '');
};
const pad = n => String(n).padStart(2, '0');
const ymd = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function toast(msg, type = '') {
  const el = document.createElement('div');
  el.className = 'toast ' + type;
  el.textContent = msg;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 300); }, 2800);
}

const Store = {
  async get(k, def = null) {
    try {
      const P = window.Capacitor?.Plugins?.Preferences;
      const v = P ? (await P.get({ key: k })).value : localStorage.getItem(k);
      return v == null ? def : JSON.parse(v);
    } catch { return def; }
  },
  async set(k, v) {
    const s = JSON.stringify(v);
    const P = window.Capacitor?.Plugins?.Preferences;
    try { P ? await P.set({ key: k, value: s }) : localStorage.setItem(k, s); } catch {}
  },
  async del(k) {
    const P = window.Capacitor?.Plugins?.Preferences;
    try { P ? await P.remove({ key: k }) : localStorage.removeItem(k); } catch {}
  },
};

function parseHTML(html) { return new DOMParser().parseFromString(html, 'text/html'); }
