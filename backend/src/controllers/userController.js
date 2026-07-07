const User = require('../models/User');

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private (Admin)
const getUsers = async (req, res, next) => {
  try {
    const { search, role } = req.query;
    const query = {};

    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Block or Unblock a user
// @route   PUT /api/users/:id/status
// @access  Private (Admin)
const updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status || !['active', 'blocked'].includes(status)) {
      res.statusCode = 400;
      throw new Error('Please provide a valid status (active or blocked)');
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      res.statusCode = 404;
      throw new Error('User not found');
    }

    // Prevent blocking oneself
    if (user._id.toString() === req.user._id.toString()) {
      res.statusCode = 400;
      throw new Error('You cannot block your own administrative account');
    }

    user.status = status;
    await user.save();

    res.json({
      success: true,
      message: `User account is now ${status}`,
      user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  updateUserStatus,
};
