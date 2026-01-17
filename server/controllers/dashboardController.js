const Task = require('../models/Task');
const mongoose = require('mongoose');

// @desc    Get dashboard stats
// @route   GET /api/dashboard
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const totalTasks = await Task.countDocuments({ user: userId });
    const completedTasks = await Task.countDocuments({
      user: userId,
      status: 'Completed',
    });
    const pendingTasks = await Task.countDocuments({
      user: userId,
      status: { $ne: 'Completed' },
    });

    // Aggregation for priority distribution
    const priorityStats = await Task.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      totalTasks,
      completedTasks,
      pendingTasks,
      priorityStats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };
