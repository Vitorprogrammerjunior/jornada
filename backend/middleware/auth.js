// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();
module.exports = function auth(...allowedRoles) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Token não fornecido' });

    const token = authHeader.split(' ')[1];
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
      console.log('▶️  decoded JWT payload:', payload);
    } catch (err) {
      console.error('Auth error:', err);
      return res.status(401).json({ message: 'Token inválido' });
    }

    // payload provavelmente é { user: [ { … } ] } e não { role: 'leader' }
    // então vamos extrair o user correto:
    if (payload.user) {
      const u = Array.isArray(payload.user) ? payload.user[0] : payload.user;
      req.user = u;
    } else {
      req.user = payload;
    }

    if (allowedRoles.length && !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    next();
  };
};
