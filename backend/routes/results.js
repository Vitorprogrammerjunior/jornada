
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// @route   GET api/results
// @desc    Get results for all groups (or filtered by user's group)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Here you would fetch the results from the database
    // For coordinators, fetch all results
    // For leaders/students, fetch only their group's results
    
    // Calculate group results based on submissions
    // For now, we'll use mock data
    const results = [
      {
        groupId: '1',
        groupName: 'Engenharia Team Alpha',
        courseId: 'ENG',
        phaseResults: [
          {
            phaseId: '1',
            phaseName: 'Formação das Equipes',
            submissionId: '1',
            grade: 95,
            isLate: false,
            maxGrade: 100,
            submittedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000)
          },
          {
            phaseId: '2',
            phaseName: 'Entrega da Proposta Inicial',
            submissionId: '2',
            grade: 90,
            isLate: false,
            maxGrade: 100,
            submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
          }
        ],
        totalScore: 185,
        averageScore: 92.5,
        rank: 1,
        totalGroups: 2
      },
      {
        groupId: '2',
        groupName: 'Direito Team Justicia',
        courseId: 'DIR',
        phaseResults: [
          {
            phaseId: '1',
            phaseName: 'Formação das Equipes',
            submissionId: '3',
            grade: 87,
            isLate: false,
            maxGrade: 100,
            submittedAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000)
          }
        ],
        totalScore: 87,
        averageScore: 87,
        rank: 2,
        totalGroups: 2
      }
    ];

    // If user is not a coordinator, filter for their group only
    if (req.user.role !== 'coordinator') {
      // Here you would get the user's groupId from the database
      const userGroupId = '1'; // Mock data
      const filteredResults = results.filter(result => result.groupId === userGroupId);
      return res.json({ success: true, results: filteredResults });
    }

    res.json({ success: true, results });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET api/results/rankings
// @desc    Get rankings of all groups
// @access  Private
router.get('/rankings', auth, async (req, res) => {
  try {
    // Here you would calculate and fetch the rankings from the database
    // For now, we'll use mock data
    const rankings = [
      {
        rank: 1,
        groupId: '1',
        groupName: 'Engenharia Team Alpha',
        courseId: 'ENG',
        totalScore: 185,
        averageScore: 92.5,
        completedPhases: 2,
        totalPhases: 6
      },
      {
        rank: 2,
        groupId: '2',
        groupName: 'Direito Team Justicia',
        courseId: 'DIR',
        totalScore: 87,
        averageScore: 87,
        completedPhases: 1,
        totalPhases: 6
      },
      {
        rank: 3,
        groupId: '3',
        groupName: 'Medicina Team Saúde',
        courseId: 'MED',
        totalScore: 83,
        averageScore: 83,
        completedPhases: 1,
        totalPhases: 6
      }
    ];

    res.json({ success: true, rankings });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET api/results/courses
// @desc    Get rankings by course
// @access  Private
router.get('/courses', auth, async (req, res) => {
  try {
    // Here you would calculate and fetch the course rankings from the database
    // For now, we'll use mock data
    const courseRankings = [
      {
        courseId: 'ENG',
        courseName: 'Engenharia',
        averageScore: 92.5,
        groups: 1,
        completedPhases: 2,
        rank: 1
      },
      {
        courseId: 'DIR',
        courseName: 'Direito',
        averageScore: 87,
        groups: 1,
        completedPhases: 1,
        rank: 2
      },
      {
        courseId: 'MED',
        courseName: 'Medicina',
        averageScore: 83,
        groups: 1,
        completedPhases: 1,
        rank: 3
      }
    ];

    res.json({ success: true, courseRankings });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
