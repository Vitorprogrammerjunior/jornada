
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function(req, file, cb) {
    const filetypes = /pdf|doc|docx|ppt|pptx|zip/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      return cb(null, true);
    }
    cb(new Error('Only document and archive files are allowed'));
  }
}).single('file');

// @route   GET api/submissions
// @desc    Get all submissions (filtered by group for students/leaders)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // For coordinators, fetch all submissions
    // For leaders/students, fetch only their group's submissions
    // Here you would query the database with the appropriate filter
    // For now, we'll use mock data
    
    let submissions = [
      {
        id: '1',
        groupId: '1',
        phaseId: '1',
        fileUrl: '/uploads/example1.pdf',
        submittedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        submittedBy: '2',
        grade: 95,
        feedback: 'Excelente trabalho! A proposta está bem estruturada.',
        gradedBy: '1',
        gradedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        groupId: '1',
        phaseId: '2',
        fileUrl: '/uploads/example2.pdf',
        submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        submittedBy: '2',
        grade: null,
        feedback: null,
        gradedBy: null,
        gradedAt: null
      },
      {
        id: '3',
        groupId: '2',
        phaseId: '1',
        fileUrl: '/uploads/example3.pdf',
        submittedAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000),
        submittedBy: '5',
        grade: 87,
        feedback: 'Bom trabalho, mas poderia melhorar em algumas áreas.',
        gradedBy: '1',
        gradedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000)
      }
    ];

    // If user is not a coordinator, filter for their group only
    if (req.user.role !== 'coordinator') {
      // Here you would get the user's groupId from the database
      const userGroupId = '1'; // Mock data
      submissions = submissions.filter(sub => sub.groupId === userGroupId);
    }

    res.json({ success: true, submissions });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST api/submissions
// @desc    Submit a new file for a phase
// @access  Private (leader only)
router.post('/', auth, (req, res) => {
  try {
    if (req.user.role !== 'leader') {
      return res.status(403).json({ success: false, message: 'Only group leaders can submit files' });
    }

    upload(req, res, async function(err) {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }

      const { phaseId } = req.body;
      if (!phaseId) {
        return res.status(400).json({ success: false, message: 'Phase ID is required' });
      }

      // Here you would get the user's groupId from the database
      const userGroupId = '1'; // Mock data

      // Here you would create the submission in the database
      const submission = {
        id: Date.now().toString(),
        groupId: userGroupId,
        phaseId,
        fileUrl: `/uploads/${req.file.filename}`,
        submittedAt: new Date(),
        submittedBy: req.user.id,
        grade: null,
        feedback: null,
        gradedBy: null,
        gradedAt: null
      };

      res.json({ success: true, submission });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT api/submissions/:id/grade
// @desc    Grade a submission
// @access  Private (coordinator only)
router.put('/:id/grade', [
  auth,
  [
    check('grade', 'Grade is required and must be between 0 and 100').isFloat({ min: 0, max: 100 }),
    check('feedback', 'Feedback is required').not().isEmpty()
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

    const submissionId = req.params.id;
    const { grade, feedback } = req.body;
    
    // Here you would fetch and update the submission in the database
    // For now, we'll use mock data
    const submission = {
      id: submissionId,
      groupId: '1',
      phaseId: '2',
      fileUrl: '/uploads/example2.pdf',
      submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      submittedBy: '2'
    };

    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    // Update with grade
    const updatedSubmission = {
      ...submission,
      grade,
      feedback,
      gradedBy: req.user.id,
      gradedAt: new Date()
    };

    res.json({ success: true, submission: updatedSubmission });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
