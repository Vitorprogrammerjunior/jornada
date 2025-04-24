const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const auth = require('../middleware/authMidleware');

// Só coordenador pode ver todas as solicitações
router.get('/', auth, async (req, res) => {
    if (!req.user || req.user.role !== 'coordinator') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    try {
      const [rows] = await pool.query(
        `SELECT lr.id,
                lr.user_id AS userId,
                u.name,
                u.email,
                lr.status,
                lr.requested_at AS requestedAt
         FROM leader_requests lr
         JOIN users u ON u.id = lr.user_id
         WHERE lr.status = 'pending'
         ORDER BY lr.requested_at DESC`
      );
      res.json({ success: true, requests: rows });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  // @route   POST /api/leader-requests



// Aprovar uma solicitação
router.put('/:requestId/approve', auth, async (req, res) => {
  if (!req.user || req.user.role !== 'coordinator') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }
  const { requestId } = req.params;
  try {
    // Marca como approved
    await pool.query(
      'UPDATE leader_requests SET status = ?, reviewed_at = NOW(), reviewed_by = ? WHERE id = ?',
      ['approved', req.user.id, requestId]
    );
    // Atualiza o papel do usuário para leader
    const [[lr]] = await pool.query(
      'SELECT user_id FROM leader_requests WHERE id = ?',
      [requestId]
    );
    await pool.query(
      'UPDATE users SET role = ? WHERE id = ?',
      ['leader', lr.user_id]
    );
    res.json({ success: true, requestId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Rejeitar uma solicitação
router.put('/:requestId/reject', auth, async (req, res) => {
  if (!req.user || req.user.role !== 'coordinator') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }
  const { requestId } = req.params;
  try {
    await pool.query(
      'UPDATE leader_requests SET status = ?, reviewed_at = NOW(), reviewed_by = ? WHERE id = ?',
      ['rejected', req.user.id, requestId]
    );
    res.json({ success: true, requestId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
