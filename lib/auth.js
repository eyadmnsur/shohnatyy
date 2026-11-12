const crypto = require('crypto');
const secret = () => process.env.APP_SECRET || ('s:' + (process.env.APP_PASSWORD || ''));
const sign = exp => crypto.createHmac('sha256', secret()).update('ok:' + exp).digest('hex');
exports.token = (days = 30) => { const exp = Date.now() + days * 864e5; return `${exp}.${sign(exp)}`; };
exports.valid = req => {
  if (!process.env.APP_PASSWORD) return false;           // refuse to run without a password
  const m = /(?:^|;\s*)app_auth=([^;]+)/.exec(req.headers.cookie || '');
  if (!m) return false;
  const [exp, sig] = m[1].split('.');
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  const a = Buffer.from(sig), b = Buffer.from(sign(exp));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};
exports.checkPassword = p => {
  const a = Buffer.from(String(p || '')), b = Buffer.from(process.env.APP_PASSWORD || '');
  return !!b.length && a.length === b.length && crypto.timingSafeEqual(a, b);
};
exports.authed = req => {
  if (exports.valid(req)) return true;
  const m = /^Bearer (.+)$/.exec(req.headers.authorization || '');
  return !!m && exports.checkPassword(m[1]);
};
