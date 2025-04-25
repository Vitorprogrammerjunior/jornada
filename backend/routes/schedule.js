const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMidleware');
const { pool } = require('../config/database');

// @route   GET /api/schedule
// @desc    Retorna todas as fases da jornada
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        id,
        name,
        description,
        start_date  AS startDate,
        end_date    AS endDate,
        is_active   AS isActive,
        \`order_num\`    AS order_num
      FROM phases
      ORDER BY order_num
    `);

    const phases = rows.map(p => ({
      id:          p.id,
      name:        p.name,
      description: p.description,
      order:       p.orderNum,
      isActive:    Boolean(p.isActive),
      // se o driver retornou Date, converte; se já era string, mantém
      startDate:   p.startDate instanceof Date ? p.startDate.toISOString() : p.startDate,
      endDate:     p.endDate   instanceof Date ? p.endDate.toISOString()   : p.endDate,
    }));

    res.json({ success: true, phases });
  } catch (err) {
    console.error('Erro ao buscar fases:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/schedule/:phaseId
// @desc    Ativa ou desativa uma fase (apenas superadmin)
// @access  Private
router.put('/:phaseId', auth, async (req, res) => {
  const { user } = req;
  const { phaseId } = req.params;
  const { isActive, startDate, endDate } = req.body;

  if (!user || user.role !== 'superadmin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  try {
    // Se for ativar, desativa todas
    if (isActive) {
      await pool.query('UPDATE phases SET is_Active = false');
    }

    // Atualiza esta fase — incluindo datas
    await pool.query(
      `UPDATE phases 
         SET is_Active  = ?, 
             start_Date = ?, 
             end_Date   = ?, 
             updated_At = NOW() 
       WHERE id = ?`,
      [
        isActive  ? 1 : 0,
        new Date(startDate),
        new Date(endDate),
        phaseId
      ]
    );

    // Busca a fase atualizada
    const [[updatedPhase]] = await pool.query(
      `SELECT id, name, description, start_Date AS startDate, end_Date AS endDate, is_Active AS isActive, order_num AS orderNum 
         FROM phases 
        WHERE id = ?`,
      [phaseId]
    );

    // --- Broadcast via Socket.io ---
    const io = req.app.get('io');
    if (io) {
      // envia para todos os clientes conectados
      io.emit('phaseUpdated', updatedPhase);
      // ou, se você usar rooms:
      // io.to('phases').emit('phaseUpdated', updatedPhase);
    }

    return res.json({ success: true, phase: updatedPhase });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});


module.exports = router;
