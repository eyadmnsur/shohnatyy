// Finds the Redis (Upstash) connection however Vercel named the variables.
const env = process.env;
const names = () => Object.keys(env);
exports.url = () => {
  if (env.SHOHNATY_DB_URL) return env.SHOHNATY_DB_URL.replace(/\/+$/, '');
  const k = names().find(n => /(KV|REDIS)_REST_(API_)?URL$/.test(n) && env[n]);
  if (k) return env[k].replace(/\/+$/, '');
  const v = names().map(n => env[n]).find(x => /^https:\/\/[^\s]*upstash\.io\/?$/.test(x || ''));
  return v ? v.replace(/\/+$/, '') : '';
};
exports.token = () => {
  if (env.SHOHNATY_DB_TOKEN) return env.SHOHNATY_DB_TOKEN;
  const k = names().find(n => /REST.*TOKEN$|^(KV|REDIS|UPSTASH).*TOKEN$/.test(n) && !/READ_ONLY/.test(n) && env[n]);
  return k ? env[k] : '';
};
exports.names = () => names().filter(n => /KV|REDIS|UPSTASH|STORAGE|SHOHNATY|APP_/.test(n)).sort();
