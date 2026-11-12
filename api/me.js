const { valid } = require('../lib/auth');
module.exports = (req, res) => res.status(valid(req) ? 200 : 401).json({ ok: valid(req) });
