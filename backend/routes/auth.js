const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');

// Middleware de autenticação (para rotas que precisem de token)
const auth = require('../middleware/auth');

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    check('courseId', 'Course ID is required').not().isEmpty(),
    check('periodSemester', 'Period semester is required').isNumeric()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    try {
      const { name, email, password, courseId, periodSemester } = req.body;
      
      // Verifica se o usuário já existe
      const [existing] = await pool.query(
        'SELECT id FROM users WHERE LOWER(email) = ?',
        [email.trim().toLowerCase()]
      );
      if (existing.length > 0) {
        return res.status(400).json({ success: false, message: 'User already exists' });
      }
      
      // Hash da senha
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Gera um ID único (utilizando uuid)
      const { v4: uuidv4 } = require('uuid');
      const id = uuidv4();
      
      // Insere o novo usuário no banco de dados
      await pool.query(
        'INSERT INTO users (id, name, email, password, role, course_id, period_semester, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [id, name, email, hashedPassword, 'pending', courseId, periodSemester, new Date()]
      );
      
      const user = { id, name, email, role: 'pending', courseId, periodSemester, createdAt: new Date() };
      
      // Gera o token JWT
      const payload = { user: { id: user.id, role: user.role } };
      jwt.sign(
        payload,
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '7d' },
        (err, token) => {
          if (err) throw err;
          res.json({ success: true, token, user: { ...user, password: undefined } });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    try {
      const { email, password } = req.body;
      
      // Busca o usuário pelo email (normalizado para minúsculas)
      const [users] = await pool.query(
        'SELECT * FROM users WHERE LOWER(email) = ?',
        [email.trim().toLowerCase()]

        
      );



      if (users.length === 0) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
      
      const user = users[0];
      console.log('Senha inserida:', password);
      console.log('Hash armazenada:', user.password);
      // Verifica a senha utilizando bcrypt
      const isMatch = await bcrypt.compare(password, user.password);
      console.log('Resultado da comparação de senha:', isMatch);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
      }

      
      
      // Gera o token JWT
      const payload = { user: { id: user.id, role: user.role } };
      jwt.sign(
        payload,
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '7d' },
        (err, token) => {
          if (err) throw err;
          // Remove o campo password da resposta
          user.password = undefined;
          res.json({ success: true, token, user });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

router.post('/logout', auth, (req, res) => {
  // Como JWT é stateless, apenas indicamos que o logout foi realizado.
  res.json({ success: true, message: 'Logout successful. Please remove the token from client storage.' });
});

// @route   GET api/auth/user
// @desc    Get logged in user
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    // Busca o usuário no banco de dados usando req.user.id
    const [users] = await pool.query(
      'SELECT * FROM users ',
      [req.user.id]
    );
    if (users.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user: users[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post(
  '/register-coordinator',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    try {
      const { name, email, password } = req.body;
      
      // Verifica se o usuário já existe (normalizando o email)
      const [existing] = await pool.query(
        'SELECT id FROM users WHERE LOWER(email) = ?',
        [email.trim().toLowerCase()]
      );
      if (existing.length > 0) {
        return res.status(400).json({ success: false, message: 'User already exists' });
      }
      
      // Gera hash da senha
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Gera um ID único (utilizando uuid)
      const { v4: uuidv4 } = require('uuid');
      const id = uuidv4();
      
      // Insere o novo coordinator, sem os campos course_id e period_semester
      await pool.query(
        'INSERT INTO users (id, name, email, password, role, created_at) VALUES (?, ?, ?, ?, ?, ?)',
        [id, name, email, hashedPassword, 'coordinator', new Date()]
      );
      
      res.status(201).json({ success: true, message: 'Coordinator created successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

// @route   POST api/auth/forgot-password
// @desc    Request password reset
// @access  Public
router.post(
  '/forgot-password',
  [check('email', 'Please include a valid email').isEmail()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    try {
      const { email } = req.body;
      
      // Verifica se o email existe no banco de dados
      const [users] = await pool.query(
        'SELECT id FROM users WHERE LOWER(email) = ?',
        [email.trim().toLowerCase()]
      );
      if (users.length === 0) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      
      // Aqui você implementaria o envio do email para reset da senha
      res.json({ success: true, message: 'Password reset email sent' });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

module.exports = router;