
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

// @route   GET api/settings
// @desc    Get all settings
// @access  Private (coordinator only)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'coordinator') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Here you would fetch settings from the database
    // For now, we'll use mock data
    const settings = {
      general: {
        siteName: 'Jornada Digital',
        siteDescription: 'Plataforma para coordenação da jornada de aprendizado digital',
        logoUrl: '/assets/logo.png',
        primaryColor: '#166534', // green-800
        maxGroupSize: 5,
        academicYear: '2024-2025'
      },
      deliveries: {
        submissionFormat: ['pdf', 'doc', 'docx', 'ppt', 'pptx'],
        maxFileSize: 10, // MB
        allowLateSubmissions: true,
        latePenaltyPercentage: 10,
        notifyOnSubmission: true,
        requireGroupApproval: true
      },
      journey: {
        journeyName: 'Jornada de Desenvolvimento de Projetos',
        journeyDescription: 'Uma jornada de aprendizado para desenvolvimento de projetos inovadores',
        currentPhaseId: '3',
        autoAdvancePhases: false,
        notifyPhaseChange: true,
        requirePhaseApproval: true
      }
    };

    res.json({ success: true, settings });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT api/settings/general
// @desc    Update general settings
// @access  Private (coordinator only)
router.put('/general', [
  auth,
  [
    check('siteName', 'Site name is required').optional(),
    check('siteDescription', 'Site description is required').optional(),
    check('maxGroupSize', 'Max group size must be a number').optional().isNumeric(),
    check('academicYear', 'Academic year is required').optional()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    if (req.user.role !== 'coordinator') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { siteName, siteDescription, logoUrl, primaryColor, maxGroupSize, academicYear } = req.body;
    
    // Here you would update the settings in the database
    // For now, we'll use mock data
    const updatedSettings = {
      siteName: siteName || 'Jornada Digital',
      siteDescription: siteDescription || 'Plataforma para coordenação da jornada de aprendizado digital',
      logoUrl: logoUrl || '/assets/logo.png',
      primaryColor: primaryColor || '#166534',
      maxGroupSize: maxGroupSize || 5,
      academicYear: academicYear || '2024-2025'
    };

    res.json({ success: true, settings: updatedSettings });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT api/settings/deliveries
// @desc    Update deliveries settings
// @access  Private (coordinator only)
router.put('/deliveries', auth, async (req, res) => {
  try {
    if (req.user.role !== 'coordinator') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { submissionFormat, maxFileSize, allowLateSubmissions, latePenaltyPercentage, notifyOnSubmission, requireGroupApproval } = req.body;
    
    // Here you would update the settings in the database
    // For now, we'll use mock data
    const updatedSettings = {
      submissionFormat: submissionFormat || ['pdf', 'doc', 'docx', 'ppt', 'pptx'],
      maxFileSize: maxFileSize || 10,
      allowLateSubmissions: allowLateSubmissions !== undefined ? allowLateSubmissions : true,
      latePenaltyPercentage: latePenaltyPercentage || 10,
      notifyOnSubmission: notifyOnSubmission !== undefined ? notifyOnSubmission : true,
      requireGroupApproval: requireGroupApproval !== undefined ? requireGroupApproval : true
    };

    res.json({ success: true, settings: updatedSettings });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT api/settings/journey
// @desc    Update journey settings
// @access  Private (coordinator only)
router.put('/journey', auth, async (req, res) => {
  try {
    if (req.user.role !== 'coordinator') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { journeyName, journeyDescription, currentPhaseId, autoAdvancePhases, notifyPhaseChange, requirePhaseApproval } = req.body;
    
    // Here you would update the settings in the database
    // For now, we'll use mock data
    const updatedSettings = {
      journeyName: journeyName || 'Jornada de Desenvolvimento de Projetos',
      journeyDescription: journeyDescription || 'Uma jornada de aprendizado para desenvolvimento de projetos inovadores',
      currentPhaseId: currentPhaseId || '3',
      autoAdvancePhases: autoAdvancePhases !== undefined ? autoAdvancePhases : false,
      notifyPhaseChange: notifyPhaseChange !== undefined ? notifyPhaseChange : true,
      requirePhaseApproval: requirePhaseApproval !== undefined ? requirePhaseApproval : true
    };

    res.json({ success: true, settings: updatedSettings });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
