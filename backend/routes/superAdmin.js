// routes/superAdmin.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMidleware');
const { pool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

// middleware que só deixa passar superadmins
function requireSuperAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'superadmin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }
  next();
}

// --------------------------------------------------
// 1. Gerenciamento de Usuários
// --------------------------------------------------

// Listar todos os usuários
router.get(
  '/users',
  auth,
  requireSuperAdmin,
  async (req, res) => {
    try {
      const [users] = await pool.query(`
        SELECT 
          id, name, email, role,
          course_id    AS courseId,
          period_semester AS periodSemester,
          created_at   AS createdAt
        FROM users
      `);
      res.json({ success: true, users });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

// Obter um usuário por ID
router.get(
  '/users/:id',
  auth,
  requireSuperAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const [[user]] = await pool.query(`
        SELECT 
          id, name, email, role,
          course_id    AS courseId,
          period_semester AS periodSemester,
          created_at   AS createdAt
        FROM users
        WHERE id = ?
      `, [id]);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      res.json({ success: true, user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

// Atualizar um usuário
router.put(
  '/users/:id',
  auth,
  requireSuperAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, role, courseId, periodSemester } = req.body;
      const fields = [];
      const values = [];

      if (name)            { fields.push('name = ?');           values.push(name); }
      if (email)           { fields.push('email = ?');          values.push(email); }
      if (role)            { fields.push('role = ?');           values.push(role); }
      if (courseId)        { fields.push('course_id = ?');      values.push(courseId); }
      if (periodSemester!=null) { fields.push('period_semester = ?'); values.push(periodSemester); }

      if (fields.length === 0) {
        return res.status(400).json({ success: false, message: 'No fields to update' });
      }

      await pool.query(
        `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
        [...values, id]
      );

      const [[updated]] = await pool.query(`
        SELECT 
          id, name, email, role,
          course_id    AS courseId,
          period_semester AS periodSemester,
          created_at   AS createdAt
        FROM users
        WHERE id = ?
      `, [id]);

      res.json({ success: true, user: updated });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

// Excluir um usuário
router.delete(
  '/users/:id',
  auth,
  requireSuperAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      await pool.query(`DELETE FROM users WHERE id = ?`, [id]);
      res.json({ success: true, message: 'User deleted' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);


// --------------------------------------------------
// 2. Gerenciamento de Fases
// --------------------------------------------------

// Listar todas as fases
router.get(
  '/phases',
  auth,
  requireSuperAdmin,
  async (req, res) => {
    try {
      const [phases] = await pool.query(`
        SELECT 
          id,
          name,
          description,
          start_date  AS startDate,
          end_date    AS endDate,
          \`order\`,
          is_active   AS isActive
        FROM phases
        ORDER BY \`order\`
      `);
      res.json({ success: true, phases });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

// Criar nova fase
router.post(
  '/phases',
  auth,
  requireSuperAdmin,
  async (req, res) => {
    try {
      const { name, description, startDate, endDate, order } = req.body;
      const id = uuidv4();
      await pool.query(
        `INSERT INTO phases 
           (id, name, description, start_date, end_date, \`order\`, is_active)
         VALUES (?,?,?,?,?,?,false)`,
        [id, name, description, startDate, endDate, order]
      );
      const [[phase]] = await pool.query(
        `SELECT 
           id, name, description,
           start_date  AS startDate,
           end_date    AS endDate,
           \`order\`,
           is_active   AS isActive
         FROM phases
         WHERE id = ?`,
        [id]
      );
      res.json({ success: true, phase });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

// Editar fase
router.put(
  '/phases/:phaseId',
  auth,
  requireSuperAdmin,
  async (req, res) => {
    try {
      const { phaseId } = req.params;
      const { name, description, startDate, endDate, order } = req.body;
      const fields = [];
      const values = [];
      if (name)        { fields.push('name = ?');        values.push(name); }
      if (description) { fields.push('description = ?'); values.push(description); }
      if (startDate)   { fields.push('start_date = ?');  values.push(startDate); }
      if (endDate)     { fields.push('end_date = ?');    values.push(endDate); }
      if (order!=null) { fields.push('`order` = ?');     values.push(order); }

      if (!fields.length) {
        return res.status(400).json({ success: false, message: 'No fields to update' });
      }

      await pool.query(
        `UPDATE phases SET ${fields.join(', ')} WHERE id = ?`,
        [...values, phaseId]
      );
      const [[phase]] = await pool.query(`
        SELECT 
          id, name, description,
          start_date  AS startDate,
          end_date    AS endDate,
          \`order\`,
          is_active   AS isActive
        FROM phases
        WHERE id = ?
      `, [phaseId]);
      res.json({ success: true, phase });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

// Iniciar uma fase (tornar ativa e desativar as outras)
router.put(
  '/phases/:phaseId/start',
  auth,
  requireSuperAdmin,
  async (req, res) => {
    const { phaseId } = req.params;
    try {
      await pool.query(`UPDATE phases SET is_active = false`);
      await pool.query(`UPDATE phases SET is_active = true WHERE id = ?`, [phaseId]);
      res.json({ success: true, phaseId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

// Finalizar (desativar) uma fase
router.put(
  '/phases/:phaseId/finish',
  auth,
  requireSuperAdmin,
  async (req, res) => {
    const { phaseId } = req.params;
    try {
      await pool.query(`UPDATE phases SET is_active = false WHERE id = ?`, [phaseId]);
      res.json({ success: true, phaseId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

// Excluir fase
router.delete(
  '/phases/:phaseId',
  auth,
  requireSuperAdmin,
  async (req, res) => {
    const { phaseId } = req.params;
    try {
      await pool.query(`DELETE FROM phases WHERE id = ?`, [phaseId]);
      res.json({ success: true, phaseId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);


// --------------------------------------------------
// 3. Progresso de Grupos
// --------------------------------------------------

// Percentual de todos os grupos
router.get(
  '/groups/progress',
  auth,
  requireSuperAdmin,
  async (req, res) => {
    try {
      // total de fases
      const [[{ totalPhases }]] = await pool.query(`SELECT COUNT(*) AS totalPhases FROM phases`);
      // todos os grupos
      const [groups] = await pool.query(`SELECT id, name FROM groups`);
      // para cada: conta entregas distintas
      const result = await Promise.all(groups.map(async g => {
        const [[{ completed }]] = await pool.query(
          `SELECT COUNT(DISTINCT phase_id) AS completed 
           FROM submissions 
           WHERE group_id = ?`,
          [g.id]
        );
        const progress = totalPhases
          ? Math.round((completed / totalPhases) * 100)
          : 0;
        return { ...g, progress };
      }));
      res.json({ success: true, result });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

// Percentual de um grupo específico
router.get(
  '/groups/:groupId/progress',
  auth,
  requireSuperAdmin,
  async (req, res) => {
    try {
      const { groupId } = req.params;
      const [[{ totalPhases }]] = await pool.query(`SELECT COUNT(*) AS totalPhases FROM phases`);
      const [[{ completed }]] = await pool.query(
        `SELECT COUNT(DISTINCT phase_id) AS completed 
         FROM submissions 
         WHERE group_id = ?`,
        [groupId]
      );
      const progress = totalPhases
        ? Math.round((completed / totalPhases) * 100)
        : 0;
      res.json({ success: true, groupId, progress });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);


// --------------------------------------------------
// 4. Estatísticas Gerais
// --------------------------------------------------

router.get(
  '/stats',
  auth,
  requireSuperAdmin,
  async (req, res) => {
    try {
      const [[u]] = await pool.query(`SELECT COUNT(*) AS totalUsers FROM users`);
      const [[g]] = await pool.query(`SELECT COUNT(*) AS totalGroups FROM groups`);
      const [[p]] = await pool.query(`SELECT COUNT(*) AS totalPhases FROM phases`);
      const [[s]] = await pool.query(`SELECT COUNT(*) AS totalSubmissions FROM submissions`);
      res.json({
        success: true,
        stats: {
          totalUsers: u.totalUsers,
          totalGroups: g.totalGroups,
          totalPhases: p.totalPhases,
          totalSubmissions: s.totalSubmissions
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

module.exports = router;
