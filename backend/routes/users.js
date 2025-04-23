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
    if (!req.user || req.user.role !== 'coordinator') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const [rows] = await pool.query(
      'SELECT id, name, email, role, created_at AS createdAt FROM users'
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



module.exports = router;
