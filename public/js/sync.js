// Keeps app data identical on every device (phone app + website) through the app's own server.
// Local copy stays the source for the UI; every change is pushed, and other devices' changes are pulled.
const Sync = (() => {
  const LOCAL_ONLY = new Set(['device_token', 'sync_cfg', 'sync_t', 'sync_dirty', 'alerts_log', 'alerts_read_at', 'status_seen', 'pay_seen', 'shopify_last_check', 'open_alerts', 'reasons']);
  const P = () => window.Capacitor?.Plugins?.Preferences;
  const raw = {
    async get(k) { try { return P() ? (await P().get({ key: k })).value : localStorage.getItem(k); } catch { return null; } },
    async set(k, v) { try { P() ? await P().set({ key: k, value: v }) : localStorage.setItem(k, v); } catch {} },
    async del(k) { try { P() ? await P().remove({ key: k }) : localStorage.removeItem(k); } catch {} },
    async keys() { try { if (P()) return (await P().keys()).keys; return Object.keys(localStorage); } catch { return []; } },
  };
  const J = async (k, d) => { try { const v = await raw.get(k); return v == null ? d : JSON.parse(v); } catch { return d; } };
  let cfg = null, tmap = {}, dirty = {}, busy = false, last = 0;
  const syncable = k => !LOCAL_ONLY.has(k);

  async function conf() {
    if (window.SYNC_BASE) return { base: window.SYNC_BASE, headers: {} };
    const c = await J('sync_cfg', null);
    return c && c.url && c.password ? { base: c.url.replace(/\/+$/, ''), headers: { Authorization: 'Bearer ' + c.password } } : null;
  }
  async function call(method, body) {
    const r = await fetch(cfg.base + '/api/store', { method, cache: 'no-store', credentials: 'include', headers: { ...cfg.headers, ...(body ? { 'Content-Type': 'application/json' } : {}) }, body: body ? JSON.stringify(body) : undefined });
    if (!r.ok) throw new Error('sync ' + r.status);
    return r.json();
  }
  const saveMeta = async () => { await raw.set('sync_t', JSON.stringify(tmap)); await raw.set('sync_dirty', JSON.stringify(dirty)); };
  async function flush() {
    const items = Object.entries(dirty).map(([k, d]) => ({ k, v: d.v, t: d.t }));
    if (!items.length || !cfg) return;
    for (let i = 0; i < items.length; i += 50) await call('POST', { items: items.slice(i, i + 50) });
    dirty = {}; await saveMeta();
  }
  // Record a local change; push it right away (kept in a queue if offline).
  async function changed(k, v) {
    if (!syncable(k)) return;
    const t = Date.now(); tmap[k] = t; dirty[k] = { v, t }; await saveMeta();
    if (cfg) flush().catch(() => {});
  }
  // Pull the server's data. Returns the list of keys that changed here.
  async function pull() {
    if (!cfg || busy) return [];
    busy = true;
    try {
      await flush();
      const { items } = await call('GET');
      const ch = [];
      for (const [k, e] of Object.entries(items || {})) {
        if (!syncable(k) || (tmap[k] || 0) >= (e.t || 0)) continue;
        if (e.v === null) await raw.del(k); else await raw.set(k, e.v);
        tmap[k] = e.t; ch.push(k);
      }
      // First time on this device: send what the server doesn't have yet.
      for (const k of await raw.keys()) if (syncable(k) && !(k in (items || {})) && !dirty[k]) { const v = await raw.get(k); if (v != null) { tmap[k] = tmap[k] || Date.now(); dirty[k] = { v, t: tmap[k] }; } }
      await flush(); await saveMeta(); last = Date.now();
      return ch;
    } finally { busy = false; }
  }
  async function init() {
    tmap = await J('sync_t', {}); dirty = await J('sync_dirty', {}); cfg = await conf();
    if (!cfg) return;
    try { await Promise.race([pull(), new Promise((_, no) => setTimeout(no, 3000))]); } catch {}
  }
  async function enable(url, password) {
    await raw.set('sync_cfg', JSON.stringify({ url, password })); cfg = await conf();
    tmap = await J('sync_t', {}); dirty = await J('sync_dirty', {});
    return pull();
  }
  async function disable() { await raw.del('sync_cfg'); cfg = null; }
  return { init, pull, enable, disable, changed, get on() { return !!cfg; }, get last() { return last; }, async config() { return J('sync_cfg', null); } };
})();
// Every Store write also goes to the server.
(() => {
  const set = Store.set.bind(Store), del = Store.del.bind(Store);
  Store.set = async (k, v) => { await set(k, v); Sync.changed(k, JSON.stringify(v)); };
  Store.del = async k => { await del(k); Sync.changed(k, null); };
})();
