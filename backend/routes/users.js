const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const auth = require('../middleware/authMidleware');

/**
 * @route   GET api/users
 * @desc    Get all users
 * @access  Private (coordinator only)
 */
router.get('/', auth, async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'coordinator' && req.user.role !== 'superadmin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const [rows] = await pool.query(
      'SELECT id, name, email, role, created_at AS createdAt, course_id, period_semester  FROM users'
    );
    res.json({ success: true, users: rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * @route   GET api/users/pending
 * @desc    Get all pending users (new registrations)
 * @access  Private (coordinator only)
 */
router.get('/pending', auth, async (req, res) => {
  try {
    if (req.user.role !== 'coordinator') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const [rows] = await pool.query(
      "SELECT id, name, email, course_id AS courseId, period_semester AS periodSemester, created_at AS createdAt FROM users WHERE role = 'pending'"
    );
    res.json({ success: true, users: rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * @route   PUT api/users/approve/:userId
 * @desc    Approve a pending user registration
 * @access  Private (coordinator only)
 */
router.put('/approve/:userId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'coordinator') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const { userId } = req.params;
    await pool.query(
      "UPDATE users SET role = 'student', approved_by = ? WHERE id = ?",
      [req.user.id, userId]
    );
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

/**
 * @route   PUT api/users/reject/:userId
 * @desc    Reject a pending user registration
 * @access  Private (coordinator only)
 */
router.put('/reject/:userId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'coordinator') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const { userId } = req.params;
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

// @desc    Student requests to become a group leader
// @access  Private (student only)
router.post('/request-leader', auth, async (req, res) => {
  // só quem for student pode pedir
  if (!req.user || req.user.role !== 'student') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  try {
    // opcional: não permitir duplicatas
    const [[existing]] = await pool.query(
      'SELECT id FROM leader_requests WHERE user_id = ? AND status = ?',
      [req.user.id, 'pending']
    );
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: 'Você já tem uma solicitação pendente.' });
    }

    // insere a nova solicitação
    await pool.query(
      'INSERT INTO leader_requests (user_id, status, requested_at) VALUES (?, ?, NOW())',
      [req.user.id, 'pending']
    );

    res.json({ success: true, message: 'Solicitação enviada com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});



module.exports = router;
