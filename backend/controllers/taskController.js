const Task = require('../models/Task');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

// @desc    Get all tasks for a user
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res) => {
  try {
    const { status, priority, sortBy, order } = req.query;

    // Build query object
    const query = { user: req.user.id };

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by priority
    if (priority) {
      query.priority = priority;
    }

    // Build sort object
    const sort = {};
    if (sortBy) {
      sort[sortBy] = order === 'desc' ? -1 : 1;
    } else {
      sort.createdAt = -1; // Default sort by newest first
    }

    const tasks = await Task.find(query).sort(sort);

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = async (req, res) => {
  try {
    // Check if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid task ID' });
    }

    const task = await Task.findOne({
      _id: new mongoose.Types.ObjectId(req.params.id),
      user: req.user.id
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (err) {
    console.error('Error in getTask:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid task ID' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, priority, status, dueDate } = req.body;

    const newTaskData = {
      title,
      description,
      priority,
      status,
      dueDate,
      user: req.user.id
    };

    if (status === 'completed') {
      newTaskData.completedAt = new Date();
    }

    const newTask = new Task(newTaskData);

    const task = await newTask.save();

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, priority, status, dueDate } = req.body;

    // Build task object
    const taskFields = {};
    if (title) taskFields.title = title;
    if (description) taskFields.description = description;
    if (priority) taskFields.priority = priority;
    if (status) {
      taskFields.status = status;
      if (status === 'completed') {
        taskFields.completedAt = new Date();
      } else {
        taskFields.completedAt = null;
      }
    }
    if (dueDate) taskFields.dueDate = dueDate;

    // Find and update the task, ensuring user owns it
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: taskFields },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found or user not authorized' });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res) => {
  try {
    // Find and delete the task, ensuring user owns it
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found or user not authorized' });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get task statistics
// @route   GET /api/tasks/dashboard
// @access  Private
exports.getTaskStats = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const previousWeek = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const statsArray = await Task.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalTasks: { $sum: 1 },
          completedTasks: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          pendingTasks: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          inProgressTasks: {
            $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] }
          },
          overdueTasks: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ['$status', 'completed'] },
                    { $lt: ['$dueDate', now] }
                  ]
                },
                1,
                0
              ]
            }
          },
          completedLastWeek: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$status', 'completed'] },
                    { $gte: [{ $ifNull: ['$completedAt', '$updatedAt'] }, lastWeek] }
                  ]
                },
                1,
                0
              ]
            }
          },
          completedPreviousWeek: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$status', 'completed'] },
                    { $lt: [{ $ifNull: ['$completedAt', '$updatedAt'] }, lastWeek] },
                    { $gte: [{ $ifNull: ['$completedAt', '$updatedAt'] }, previousWeek] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    // Monthly flow - group by month for the last 6 months
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const flow = await Task.aggregate([
      {
        $match: {
          user: userId,
          status: 'completed',
          $or: [
            { completedAt: { $gte: sixMonthsAgo } },
            { $and: [{ completedAt: { $exists: false } }, { updatedAt: { $gte: sixMonthsAgo } }] }
          ]
        }
      },
      {
        $group: {
          _id: {
            year: { $year: { $ifNull: ['$completedAt', '$updatedAt'] } },
            month: { $month: { $ifNull: ['$completedAt', '$updatedAt'] } }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Format flow data
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedFlow = flow.map(item => ({
      month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      count: item.count
    }));

    const result = statsArray[0] || {
      totalTasks: 0,
      completedTasks: 0,
      pendingTasks: 0,
      inProgressTasks: 0,
      overdueTasks: 0,
      completedLastWeek: 0,
      completedPreviousWeek: 0
    };

    result.flow = formattedFlow;

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    console.error('Stats Error:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};