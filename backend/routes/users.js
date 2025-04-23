const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const auth = require('../middleware/authMidleware');
// @route   GET api/users
// @desc    Get all users
// @access  Private (coordinator only)
// Exemplo de rota ajustada para prevenir erro caso req.user seja undefined
router.get('/', auth, async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'coordinator') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const [rows] = await pool.query(
      'SELECT id, name, email, role, created_at AS createdAt FROM users'
    );
    res.json({ success: true, users: rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server erro' });
  }
});
// @route   GET api/users/pending
// @desc    Get all pending users
// @access  Private (coordinator only)
router.get('/pending', auth, async (req, res) => {
  try {
    if (req.user.role !== 'coordinator') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    // Query para retornar usuários com role 'pending'
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE role = 'pending'"
    );
    res.json({ success: true, users: rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server erro' });
  }
});

// @route   PUT api/users/approve/:userId
// @desc    Approve a pending user 
// @access  Private (coordinator only)
router.put('/approve/:userId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'coordinator') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const { userId } = req.params;
    // Atualiza o usuário, definindo o role como 'student'
    await pool.query(
      "UPDATE users SET role = 'student', approved_by = ? WHERE id = ?",
      [req.user.id, userId]
    );
    // Retorna os dados atualizados do usuário
    const [rows] = await pool.query(
      "SELECT id, name, email, role, course_id AS courseId, period_semester AS periodSemester, created_at AS createdAt FROM users WHERE id = ?",
      [userId]
    );
    res.json({ success: true, user: rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT api/users/reject/:userId
// @desc    Reject a pending user
// @access  Private (coordinator only)
router.put('/reject/:userId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'coordinator') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const { userId } = req.params;
    // Neste exemplo, rejeitar o usuário atualizando o role para 'inactive'
    await pool.query(
      "UPDATE users SET role = 'inactive' WHERE id = ?",
      [userId]
    );
    res.json({ success: true, message: 'User rejected successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT api/users/request-leader
// @desc    Request to be a group leader 
// @access  Private (student only)
router.put('/request-leader', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    // Exemplo: atualiza o usuário para indicar que solicitou tornar-se líder 
    // (a lógica de negócio pode variar; aqui usamos 'pending' - ou crie uma coluna específica).
    await pool.query(
      "UPDATE users SET role = 'pending' WHERE id = ?",
      [req.user.id]
    );
    // Retorna os dados atualizados do usuário
    const [rows] = await pool.query(
      "SELECT id, name, email, role, course_id AS courseId, period_semester AS periodSemester, created_at AS createdAt FROM users WHERE id = ?",
      [req.user.id]
    );
    res.json({ success: true, user: rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


module.exports = router;