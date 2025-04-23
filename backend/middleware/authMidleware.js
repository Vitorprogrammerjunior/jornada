// filepath: c:\Users\Vitor.Vagmaker\Documents\backend\middleware\authMidleware.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers['x-auth-token'];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Token não fornecido' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    req.user = decoded.user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token inválido' });
  }
};