// Same-origin relay to the courier portal and to the merchant's own Shopify store.
// Only these two destinations are allowed, and only after the app password was entered.
const { valid } = require('../lib/auth');
const HAZEM = process.env.HAZEM_BASE || 'https://hazem-halan.com';
const readBody = req => new Promise((ok, no) => { const c = []; req.on('data', d => c.push(d)); req.on('end', () => ok(Buffer.concat(c))); req.on('error', no); });

module.exports = async (req, res) => {
  if (!valid(req)) return res.status(401).send('locked');
  const u = new URL(req.url, 'http://x');
  const kind = u.searchParams.get('kind'), path = u.searchParams.get('path') || '', host = u.searchParams.get('host') || '';
  u.searchParams.delete('kind'); u.searchParams.delete('path'); u.searchParams.delete('host');
  const qs = u.searchParams.toString();
  let target, isHazem = false;
  if (kind === 'hz') { target = `${HAZEM}/${path}`; isHazem = true; }
  else if (kind === 'sp' && /^[a-z0-9-]+\.myshopify\.com$/i.test(host)) target = `https://${host}/${path}`;
  else return res.status(400).send('bad target');
  if (qs) target += (target.includes('?') ? '&' : '?') + qs;

  const headers = { 'user-agent': 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/124 Mobile Safari/537.36' };
  for (const h of ['content-type', 'x-requested-with', 'x-shopify-access-token', 'accept']) if (req.headers[h]) headers[h] = req.headers[h];
  if (isHazem) {
    const ck = (req.headers.cookie || '').split(/;\s*/).filter(c => c && !c.startsWith('app_auth=')).join('; ');
    if (ck) headers.cookie = ck;
    headers.referer = HAZEM + '/admin-area/'; headers.origin = HAZEM;
  }
  const hasBody = !['GET', 'HEAD'].includes(req.method);
  const body = hasBody ? await readBody(req) : undefined;
  let r;
  try { r = await fetch(target, { method: req.method, headers, body, redirect: 'manual' }); }
  catch (e) { return res.status(502).send('upstream error'); }

  const out = [];
  if (isHazem) for (const c of (r.headers.getSetCookie?.() || [])) {
    let s = c.replace(/;\s*domain=[^;]*/ig, '').replace(/;\s*samesite=[^;]*/ig, '').replace(/;\s*path=[^;]*/ig, '');
    if (/^adminId=/.test(s)) s = s.replace(/;\s*httponly/ig, '');
    out.push(s + '; Path=/; SameSite=Lax; Secure');
  }
  if (out.length) res.setHeader('Set-Cookie', out);
  const loc = r.headers.get('location');
  if (loc && r.status >= 300 && r.status < 400) {
    let l = loc.replace(/^https?:\/\/(www\.)?hazem-halan\.com/i, '/hz');
    if (l.startsWith('/') && !l.startsWith('/hz')) l = '/hz' + l;
    res.setHeader('Location', l);
  }
  const ct = r.headers.get('content-type'); if (ct) res.setHeader('Content-Type', ct);
  res.setHeader('Cache-Control', 'no-store');
  res.status(r.status).send(Buffer.from(await r.arrayBuffer()));
};

module.exports.config = { api: { bodyParser: false }, maxDuration: 30 };
