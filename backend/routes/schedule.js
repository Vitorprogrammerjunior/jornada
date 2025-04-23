
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// @route   GET api/schedule
// @desc    Get journey schedule
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Here you would fetch the journey phases from the database
    // For now, we'll use mock data
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    
    const phases = [
      {
        id: '1',
        name: 'Formação das Equipes',
        description: 'Período para formação e cadastro das equipes participantes',
        startDate: new Date(now.getTime() - 30 * oneDay), // 30 days ago
        endDate: new Date(now.getTime() - 15 * oneDay), // 15 days ago
        isActive: false,
        order: 1
      },
      {
        id: '2',
        name: 'Entrega da Proposta Inicial',
        description: 'Entrega do documento com a proposta inicial do projeto',
        startDate: new Date(now.getTime() - 15 * oneDay), // 15 days ago
        endDate: new Date(now.getTime() - 1 * oneDay), // Yesterday
        isActive: false,
        order: 2
      },
      {
        id: '3',
        name: 'Desenvolvimento do Projeto',
        description: 'Período principal de desenvolvimento do projeto proposto',
        startDate: new Date(now.getTime()), // Today
        endDate: new Date(now.getTime() + 30 * oneDay), // 30 days from now
        isActive: true,
        order: 3
      },
      {
        id: '4',
        name: 'Entrega do Relatório Parcial',
        description: 'Entrega do relatório com o andamento parcial do projeto',
        startDate: new Date(now.getTime() + 30 * oneDay), // 30 days from now
        endDate: new Date(now.getTime() + 45 * oneDay), // 45 days from now
        isActive: false,
        order: 4
      },
      {
        id: '5',
        name: 'Finalização e Testes',
        description: 'Período para finalização e testes do projeto',
        startDate: new Date(now.getTime() + 45 * oneDay), // 45 days from now
        endDate: new Date(now.getTime() + 60 * oneDay), // 60 days from now
        isActive: false,
        order: 5
      },
      {
        id: '6',
        name: 'Apresentação Final',
        description: 'Apresentação final dos projetos desenvolvidos',
        startDate: new Date(now.getTime() + 60 * oneDay), // 60 days from now
        endDate: new Date(now.getTime() + 62 * oneDay), // 62 days from now
        isActive: false,
        order: 6
      }
    ];

    res.json({ success: true, phases });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT api/schedule/:phaseId
// @desc    Update a phase (coordinator only)
// @access  Private
router.put('/:phaseId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'coordinator') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const phaseId = req.params.phaseId;
    const { name, description, startDate, endDate } = req.body;
    
    // Here you would fetch and update the phase in the database
    // For now, we'll use mock data
    const updatedPhase = {
      id: phaseId,
      name: name || 'Phase Name',
      description: description || 'Phase Description',
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      isActive: true,
      order: 3
    };

    res.json({ success: true, phase: updatedPhase });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
