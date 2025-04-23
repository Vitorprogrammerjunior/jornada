const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Normaliza o email para comparações
    const normalizedEmail = email.trim().toLowerCase();
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE LOWER(email) = ?',
      [normalizedEmail]
    );
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const user = rows[0];
    console.log('User encontrado:', user);
    
    // Normaliza também a senha recebida
    const inputPassword = password.trim();
    if (user.password !== inputPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const payload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
    
    res.json({ success: true, token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erro no servidor' });
  }

  
});



// Cadastro de usuário
// Cadastro de usuário
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body; // Removemos id
  const id = uuidv4(); // Geramos o id automaticamente
  try {
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Email já cadastrado' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

  await pool.query(
    'INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
    [id, name, email, hashedPassword, role || 'pending']
  );
    res.status(201).json({ success: true, message: 'Usuário cadastrado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erro no servidor' });
  }
});

// Recuperação de senha
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }
    // Aqui você implementaria o envio de email com instruções para reset de senha
    res.json({ success: true, message: 'Instruções para recuperação de senha enviadas' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erro no servidor' });
  }
});



// Obter usuário atual (a partir do token enviado no header)
router.get('/user', async (req, res) => {
  const token = req.headers['x-auth-token'];
  if (!token)
    return res.status(401).json({ success: false, message: 'Token não fornecido' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const userId = decoded.user.id;
    // Use o placeholder para filtrar pelo id
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    res.json({ success: true, user: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(401).json({ success: false, message: 'Token inválido' });
  }
});

module.exports = router;