const { token, checkPassword } = require('../lib/auth');
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  const pw = (req.body && req.body.password) || '';
  if (!checkPassword(pw)) { await new Promise(r => setTimeout(r, 1200)); return res.status(401).json({ ok: false }); }
  res.setHeader('Set-Cookie', `app_auth=${token()}; Path=/; Max-Age=${30 * 86400}; HttpOnly; Secure; SameSite=Lax`);
  res.status(200).json({ ok: true });
};
