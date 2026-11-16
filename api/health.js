// Safe self-check: shows which database variables exist (names only, never values).

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

module.exports = async (req, res) => {
  const names = envNames().filter(n => /KV|REDIS|UPSTASH|STORAGE|SHOHNATY|APP_/.test(n)).sort();
  const out = { appPasswordSet: !!env.APP_PASSWORD, variablesSeen: names, databaseUrlFound: !!dbUrl(), databaseTokenFound: !!dbToken() };
  if (out.databaseUrlFound && out.databaseTokenFound) {
    try { const r = await fetch(dbUrl() + '/pipeline', { method: 'POST', headers: { Authorization: 'Bearer ' + dbToken() }, body: JSON.stringify([['PING']]) }); out.databaseReply = r.ok ? 'ok' : 'http ' + r.status; }
    catch (e) { out.databaseReply = 'unreachable'; }
  }
  res.setHeader('Cache-Control', 'no-store'); res.status(200).json(out);
};
