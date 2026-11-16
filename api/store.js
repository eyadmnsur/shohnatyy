// Shared app data (settings, drafts, sent orders…) so the phone app and the website show the same thing.
// Stored in a Redis database (Upstash) connected through Vercel Storage.
const { authed } = require('../lib/auth');

// ---- finds the Redis (Upstash) connection however Vercel named the variables ----
const env = process.env;
const envNames = () => Object.keys(env);
const dbUrl = () => {
  if (env.SHOHNATY_DB_URL) return env.SHOHNATY_DB_URL.replace(/\/+$/, '');
  const k = envNames().find(n => /(KV|REDIS)_REST_(API_)?URL$/.test(n) && env[n]);
  if (k) return env[k].replace(/\/+$/, '');
  const v = envNames().map(n => env[n]).find(x => /^https:\/\/[^\s]*upstash\.io\/?$/.test(x || ''));
  return v ? v.replace(/\/+$/, '') : '';
};
const dbToken = () => {
  if (env.SHOHNATY_DB_TOKEN) return env.SHOHNATY_DB_TOKEN;
  const k = envNames().find(n => /REST.*TOKEN$|^(KV|REDIS|UPSTASH).*TOKEN$/.test(n) && !/READ_ONLY/.test(n) && env[n]);
  return k ? env[k] : '';
};
const URL_ = dbUrl, TOKEN = dbToken;
const HASH = 'shohnaty';
async function redis(cmds) {
  const r = await fetch(URL_() + '/pipeline', { method: 'POST', headers: { Authorization: 'Bearer ' + TOKEN(), 'Content-Type': 'application/json' }, body: JSON.stringify(cmds) });
  if (!r.ok) throw new Error('redis ' + r.status);
  return r.json();
}
module.exports = async (req, res) => {
  if (!authed(req)) { await new Promise(r => setTimeout(r, 800)); return res.status(401).json({ error: 'locked' }); }
  if (!URL_() || !TOKEN()) return res.status(503).json({ error: 'no-database' });
  res.setHeader('Cache-Control', 'no-store');
  try {
    if (req.method === 'GET') {
      const [{ result }] = await redis([['HGETALL', HASH]]);
      const items = {};
      for (let i = 0; i < (result || []).length; i += 2) { try { items[result[i]] = JSON.parse(result[i + 1]); } catch {} }
      return res.status(200).json({ items });
    }
    if (req.method === 'POST') {
      const list = Array.isArray(req.body?.items) ? req.body.items.slice(0, 200) : [];
      const cmds = list.filter(x => x && typeof x.k === 'string' && x.k.length < 80 && (x.v === null || typeof x.v === 'string') && (x.v || '').length < 900000)
        .map(x => ['HSET', HASH, x.k, JSON.stringify({ v: x.v, t: Number(x.t) || Date.now() })]);
      if (cmds.length) await redis(cmds);
      return res.status(200).json({ ok: true, n: cmds.length });
    }
    res.status(405).end();
  } catch (e) { res.status(502).json({ error: 'db' }); }
};
