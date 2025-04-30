const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMidleware');
const { check, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

// @route   GET api/groups
// @desc    Get all groups (with their members)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // fetch groups
    const [groups] = await pool.query(
      `SELECT 
         id, name, description, leader_id AS leaderId,
         course_id AS courseId, period_semester AS periodSemester,
         created_at AS createdAt, approved_at AS approvedAt, approved_by AS approvedBy
       FROM grupos`
    );

    // for each group, fetch its members
    for (let g of groups) {
      const [members] = await pool.query(
        `SELECT 
           u.id, u.name, u.email, u.role, 
           u.created_at AS createdAt, u.course_id AS courseId, u.period_semester AS periodSemester
         FROM users u
         WHERE u.group_id = ?`,
        [g.id]
      );
      g.members = members;
    }

    res.json({ success: true, groups });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET api/groups/:id
// @desc    Get group by ID (with members)
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const groupId = req.params.id;
    const [[group]] = await pool.query(
      `SELECT 
         id, name, description, leader_id AS leaderId,
         course_id AS courseId, period_semester AS periodSemester,
         created_at AS createdAt, approved_at AS approvedAt, approved_by AS approvedBy
       FROM grupos
       WHERE id = ?`,
      [groupId]
    );
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });

    const [members] = await pool.query(
      `SELECT 
         u.id, u.name, u.email, u.role, 
         u.created_at AS createdAt, u.course_id AS courseId, u.period_semester AS periodSemester
       FROM users u
       WHERE u.group_id = ?`,
      [groupId]
    );
    group.members = members;

    res.json({ success: true, group });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST api/groups
// @desc    Create a new group
// @access  Private (leader only)
router.post(
  '/',
  auth,
  [
    check('name', 'Name is required').notEmpty(),
    check('description', 'Description is required').notEmpty(),
    check('courseId', 'Course ID is required').notEmpty(),
    check('periodSemester', 'Period semester must be a number').isNumeric(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    if (req.user.role !== 'leader') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

      // **NOVO**: verifica se esse líder já tem um grupo
   const [already] = await pool.query(
       `SELECT id, name FROM grupos WHERE leader_id = ?`,
       [req.user.id]
     );
     if (already.length > 0) {
       return res
       .status(400)
         .json({
           success: false,
           message: 'Você já possui o grupo "' + already[0].name + '". Apague-o antes de criar outro.'
        });
    }

    try {
      const { name, description, courseId, periodSemester } = req.body;
      const id = uuidv4();

      // insert into grupos
      await pool.query(
        `INSERT INTO grupos 
           (id, name, description, leader_id, course_id, period_semester)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [id, name, description, req.user.id, courseId, periodSemester]
      );

      // also update the leader's user row to set group_id
      await pool.query(
        `UPDATE users
         SET group_id = ?
         WHERE id = ?`,
        [id, req.user.id]
      );

      // return the newly created group
      const [[group]] = await pool.query(
        `SELECT 
           id, name, description, leader_id AS leaderId,
           course_id AS courseId, period_semester AS periodSemester,
           created_at AS createdAt
         FROM grupos
         WHERE id = ?`,
        [id]
      );
      group.members = [
        // fetch leader as first member
        {
          id: req.user.id,
          name: req.user.name,
          email: req.user.email,
          role: 'leader',
          createdAt: req.user.createdAt,
          courseId: req.user.course_id,      // adjust field names as needed
          periodSemester: req.user.period_semester,
        },
      ];

      res.json({ success: true, group });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  
);

/**
 * @route   POST /api/groups/:id/join
 * @desc    Student solicita entrada em um grupo
 * @access  Private (student)
 */
router.post('/:id/join', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const groupId = req.params.id;
    const requestId = uuidv4();

    // Insere na tabela grupo_requests
    await pool.query(
      `INSERT INTO grupo_requests 
         (id, student_id, grupo_id, status, created_at, updated_at)
       VALUES (?, ?, ?, 'pending', NOW(), NOW())`,
      [requestId, req.user.id, groupId]
    );

    // Busca a solicitação completa já com dados do usuário
    const [[request]] = await pool.query(
      `SELECT
         gr.id,
         gr.grupo_id     AS groupId,
         gr.student_id   AS userId,
         u.name,
         u.email,
         gr.status,
         gr.created_at   AS requestedAt
       FROM grupo_requests gr
       JOIN users u
         ON u.id = gr.student_id
       WHERE gr.id = ?`,
      [requestId]
    );

    res.json({ success: true, request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * @route   GET /api/groups/:id/join-requests
 * @desc    Líder busca as solicitações pendentes para seu grupo
 * @access  Private (leader)
 */
// GET /api/groups/:id/join-requests
router.get('/:id/join-requests', auth, async (req, res) => {
  try {
    const groupId = req.params.id;

    // Verifica se é o líder daquele grupo
    const [grp] = await pool.query(
      'SELECT leader_id FROM grupos WHERE id = ?',
      [groupId]
    );
    if (!grp.length || grp[0].leader_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Busca na tabela grupo_requests
    const [rows] = await pool.query(
      `SELECT
         gr.id,
         gr.grupo_id       AS groupId,
         gr.student_id     AS userId,
         u.name,
         u.email,
         gr.status,
         gr.created_at     AS requestedAt
       FROM grupo_requests gr
       JOIN users u
         ON u.id = gr.student_id
       WHERE gr.grupo_id = ? 
         AND gr.status = 'pending'
       ORDER BY gr.created_at DESC`,
      [groupId]
    );

    res.json({ success: true, requests: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


/**
 * @route   PUT /api/groups/:groupId/join-requests/:requestId
 * @desc    Líder aprova ou rejeita uma solicitação de entrada
 * @access  Private (leader)
 */
// @route   PUT /api/groups/:groupId/join-requests/:requestId
router.put(
  '/:groupId/join-requests/:requestId',
  [
    auth,
    check('status', 'Status inválido').isIn(['approved', 'rejected'])
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { groupId, requestId } = req.params;
      const { status } = req.body;

      // 1) valida se quem está chamando é o líder do grupo
      const [grp] = await pool.query(
        'SELECT leader_id FROM grupos WHERE id = ?',
        [groupId]
      );
      if (!grp.length || grp[0].leader_id !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      // 2) atualiza o status da solicitação na tabela grupo_requests
      await pool.query(
        `UPDATE grupo_requests
           SET status = ?
         WHERE id = ?`,
        [status, requestId]
      );

      // 3) se aprovou, atribui o grupo ao aluno
      if (status === 'approved') {
        // pega o student_id daquela request
        const [[reqRow]] = await pool.query(
          'SELECT student_id FROM grupo_requests WHERE id = ?',
          [requestId]
        );
        await pool.query(
          'UPDATE users SET group_id = ? WHERE id = ?',
          [groupId, reqRow.student_id]
        );
      }

      // 4) retorna a solicitação atualizada
      const [[updated]] = await pool.query(
        `SELECT
           id,
           grupo_id      AS groupId,
           student_id    AS userId,
           status,
           created_at    AS requestedAt,
           updated_at    AS updatedAt
         FROM grupo_requests
         WHERE id = ?`,
        [requestId]
      );

      res.json({ success: true, request: updated });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

router.delete('/:id/leave', auth, async (req, res) => {
  try {
    const groupId = req.params.id;
    // Verify user belongs to this group
    const [[userRow]] = await pool.query(
      'SELECT group_id FROM users WHERE id = ?',
      [req.user.id]
    );
    if (!userRow || userRow.group_id !== groupId) {
      return res.status(403).json({ success: false, message: 'Not authorized or not a member' });
    }
    // Remove group association
    await pool.query(
      'UPDATE users SET group_id = NULL WHERE id = ?',
      [req.user.id]
    );
    res.json({ success: true, message: 'Group left successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});






module.exports = router;
