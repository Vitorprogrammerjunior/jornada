
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

// @route   GET api/groups
// @desc    Get all groups
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Here you would fetch all groups from the database
    // For now, we'll use mock data
    const groups = [
      {
        id: '1',
        name: 'Engenharia Team Alpha',
        description: 'Grupo focado em soluções inovadoras de engenharia',
        leaderId: '2',
        members: [
          {
            id: '2',
            name: 'Leader User',
            email: 'leader@example.com',
            role: 'leader'
          },
          {
            id: '3',
            name: 'Student User',
            email: 'student@example.com',
            role: 'student'
          }
        ],
        courseId: 'ENG',
        periodSemester: 5,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
      },
      {
        id: '2',
        name: 'Direito Team Justicia',
        description: 'Grupo dedicado a análises jurídicas contemporâneas',
        leaderId: '5',
        members: [
          {
            id: '5',
            name: 'Law Leader',
            email: 'lawleader@example.com',
            role: 'leader'
          },
          {
            id: '6',
            name: 'Law Student',
            email: 'lawstudent@example.com',
            role: 'student'
          }
        ],
        courseId: 'DIR',
        periodSemester: 3,
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) // 15 days ago
      }
    ];

    res.json({ success: true, groups });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET api/groups/:id
// @desc    Get group by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const groupId = req.params.id;
    
    // Here you would fetch the group from the database
    // For now, we'll use mock data
    const group = {
      id: groupId,
      name: 'Engenharia Team Alpha',
      description: 'Grupo focado em soluções inovadoras de engenharia',
      leaderId: '2',
      members: [
        {
          id: '2',
          name: 'Leader User',
          email: 'leader@example.com',
          role: 'leader'
        },
        {
          id: '3',
          name: 'Student User',
          email: 'student@example.com',
          role: 'student'
        }
      ],
      courseId: 'ENG',
      periodSemester: 5,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
    };

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    res.json({ success: true, group });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST api/groups
// @desc    Create a new group
// @access  Private (leader only)
router.post('/', [
  auth,
  [
    check('name', 'Name is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('courseId', 'Course ID is required').not().isEmpty(),
    check('periodSemester', 'Period semester is required').isNumeric()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    if (req.user.role !== 'leader') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { name, description, courseId, periodSemester } = req.body;

    // Here you would create the group in the database
    // For now, we'll use mock data
    const newGroup = {
      id: Date.now().toString(),
      name,
      description,
      leaderId: req.user.id,
      members: [
        {
          id: req.user.id,
          name: 'Current Leader',
          email: 'leader@example.com',
          role: 'leader'
        }
      ],
      courseId,
      periodSemester,
      createdAt: new Date()
    };

    res.json({ success: true, group: newGroup });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT api/groups/:id
// @desc    Update a group
// @access  Private (leader of the group or coordinator)
router.put('/:id', [
  auth,
  [
    check('name', 'Name is required').optional(),
    check('description', 'Description is required').optional()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const groupId = req.params.id;
    
    // Here you would fetch the group from the database
    // For now, we'll use mock data
    const group = {
      id: groupId,
      name: 'Engenharia Team Alpha',
      description: 'Grupo focado em soluções inovadoras de engenharia',
      leaderId: '2',
      members: [/* ... */],
      courseId: 'ENG',
      periodSemester: 5
    };

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    // Check if user is authorized to update
    if (req.user.role !== 'coordinator' && group.leaderId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Update fields
    const { name, description } = req.body;
    const updatedGroup = {
      ...group,
      name: name || group.name,
      description: description || group.description
    };

    res.json({ success: true, group: updatedGroup });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST api/groups/:id/join
// @desc    Request to join a group
// @access  Private (student only)
router.post('/:id/join', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const groupId = req.params.id;
    
    // Here you would check if the group exists and create a join request
    // For now, we'll use mock data
    const joinRequest = {
      id: Date.now().toString(),
      groupId,
      userId: req.user.id,
      status: 'pending',
      requestedAt: new Date()
    };

    res.json({ success: true, request: joinRequest });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT api/groups/:groupId/members/:userId
// @desc    Approve/reject group join request
// @access  Private (leader of the group)
router.put('/:groupId/members/:userId', [
  auth,
  [
    check('status', 'Status is required').isIn(['approved', 'rejected'])
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { groupId, userId } = req.params;
    const { status } = req.body;
    
    // Here you would fetch the group and check if the current user is the leader
    // And then update the join request status
    // For now, we'll use mock data
    const group = {
      id: groupId,
      leaderId: req.user.id
    };

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    if (group.leaderId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Update join request
    const updatedRequest = {
      id: 'join-request-id',
      groupId,
      userId,
      status,
      requestedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      reviewedAt: new Date(),
      reviewedBy: req.user.id
    };

    res.json({ success: true, request: updatedRequest });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
