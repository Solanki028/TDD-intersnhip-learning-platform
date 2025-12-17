const User = require('../models/User');
const Course = require('../models/Course');
const Chapter = require('../models/Chapter');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    const users = await User.find({});
    res.json(users);
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        await user.deleteOne();
        res.json({ message: 'User removed' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Approve mentor
// @route   PUT /api/users/:id/approve-mentor
// @access  Private/Admin
const approveMentor = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.isApproved = true;
        const updatedUser = await user.save();
        res.json(updatedUser);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Get platform analytics
// @route   GET /api/users/analytics
// @access  Private/Admin
const getAnalytics = async (req, res) => {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalMentors = await User.countDocuments({ role: 'mentor' });
    const totalCourses = await Course.countDocuments();
    const totalChapters = await Chapter.countDocuments();

    res.json({
        totalUsers,
        totalStudents,
        totalMentors,
        totalCourses,
        totalChapters,
    });
};

module.exports = { getUsers, deleteUser, approveMentor, getAnalytics };
