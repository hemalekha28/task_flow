const express = require('express');
const { check } = require('express-validator');
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth.protect);

// @route   GET /api/tasks
// @desc    Get all tasks for a user
// @access  Private
router.get(
  '/',
  [
    check('status', 'Status must be one of: pending, in_progress, completed').optional().isIn(['pending', 'in_progress', 'completed']),
    check('priority', 'Priority must be one of: high, medium, low').optional().isIn(['high', 'medium', 'low']),
    check('sortBy', 'sortBy must be either dueDate or createdAt').optional().isIn(['dueDate', 'createdAt']),
    check('order', 'Order must be either asc or desc').optional().isIn(['asc', 'desc'])
  ],
  taskController.getTasks
);

// @route   GET /api/tasks/dashboard
// @desc    Get task statistics for dashboard
// @access  Private
router.get('/dashboard', taskController.getTaskStats);

// @route   GET /api/tasks/:id
// @desc    Get single task
// @access  Private
router.get('/:id', taskController.getTask);

// @route   POST /api/tasks
// @desc    Create new task
// @access  Private
router.post(
  '/',
  [
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description must be less than 500 characters').optional().isLength({ max: 500 }),
    check('priority', 'Priority must be one of: high, medium, low').optional().isIn(['high', 'medium', 'low']),
    check('status', 'Status must be one of: pending, in_progress, completed').optional().isIn(['pending', 'in_progress', 'completed']),
    check('dueDate', 'Please include a valid date').optional().isISO8601()
  ],
  taskController.createTask
);

// @route   PUT /api/tasks/:id
// @desc    Update task
// @access  Private
router.put(
  '/:id',
  [
    check('title', 'Title is required').optional().not().isEmpty(),
    check('description', 'Description must be less than 500 characters').optional().isLength({ max: 500 }),
    check('priority', 'Priority must be one of: high, medium, low').optional().isIn(['high', 'medium', 'low']),
    check('status', 'Status must be one of: pending, in_progress, completed').optional().isIn(['pending', 'in_progress', 'completed']),
    check('dueDate', 'Please include a valid date').optional().isISO8601()
  ],
  taskController.updateTask
);

// @route   DELETE /api/tasks/:id
// @desc    Delete task
// @access  Private
router.delete('/:id', taskController.deleteTask);

module.exports = router;
