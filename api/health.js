// Safe self-check: shows which database variables exist (names only, never values).
const db = require('../lib/db');
module.exports = async (req, res) => {
  const out = { appPasswordSet: !!process.env.APP_PASSWORD, variablesSeen: db.names(), databaseUrlFound: !!db.url(), databaseTokenFound: !!db.token() };
  if (out.databaseUrlFound && out.databaseTokenFound) {
    try { const r = await fetch(db.url() + '/pipeline', { method: 'POST', headers: { Authorization: 'Bearer ' + db.token() }, body: JSON.stringify([['PING']]) }); out.databaseReply = r.ok ? 'ok' : 'http ' + r.status; }
    catch (e) { out.databaseReply = 'unreachable'; }
  }
  res.setHeader('Cache-Control', 'no-store'); res.status(200).json(out);
};
