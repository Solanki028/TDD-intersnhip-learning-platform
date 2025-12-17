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

// @desc    Create new user (Admin only)
// @route   POST /api/users
// @access  Private/Admin
const createUser = async (req, res) => {
    const { name, email, password, role, isApproved } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    try {
        const user = await User.create({
            name,
            email,
            password,
            role,
            isApproved: isApproved !== undefined ? isApproved : true // Default to true if not specified
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user password
// @route   PUT /api/users/profile/password
// @access  Private
const updatePassword = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        if (req.body.password) {
            user.password = req.body.password;
            await user.save();
            res.json({ message: 'Password updated successfully' });
        } else {
            res.status(400).json({ message: 'Password is required' });
        }
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Toggle user active status
// @route   PUT /api/users/:id/toggle-status
// @access  Private/Admin
const toggleUserStatus = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.isActive = user.isActive === undefined ? false : !user.isActive; // Toggle status
        const updatedUser = await user.save();
        res.json({ message: `User ${updatedUser.isActive ? 'activated' : 'deactivated'}`, isActive: updatedUser.isActive });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

module.exports = { getUsers, deleteUser, approveMentor, getAnalytics, updatePassword, createUser, toggleUserStatus };
