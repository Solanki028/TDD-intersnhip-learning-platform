const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id, role, name) => {
    return jwt.sign({ id, role, name }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
};


const authUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            if (user.role === 'mentor' && !user.isApproved) {
                return res.status(403).json({ message: 'Mentor account not yet approved' });
            }
            if (user.isActive === false) {
                return res.status(403).json({ message: 'Account deactivated. Please contact admin.' });
            }

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id, user.role, user.name),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: error.message, stack: error.stack });
    }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    console.log("DEBUG: registerUser called");
    console.log("DEBUG: Request Body:", req.body);
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Auto-approve if not mentor (admin seed might be needed, but for now allow all non-mentors or default to student)
    // Logic: Student = approved, Mentor = not approved. Admin = manually seeded or special key? 
    // For Kata simplicity, allow registering as any role, but Mentor defaults to isApproved=false.

    let isApproved = true;
    if (role === 'mentor') {
        isApproved = false;
    }

    try {
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'student', // Default to student
            isApproved
        });

        if (user) {
            if (user.role === 'mentor') {
                res.status(201).json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    message: 'Registration successful. Please wait for admin approval.',
                });
            } else {
                res.status(201).json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user._id, user.role, user.name),
                });
            }
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: error.message, stack: error.stack });
    }
};

// @desc    Update user profile (password)
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            token: generateToken(updatedUser._id, updatedUser.role),
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

module.exports = { authUser, registerUser, updateUserProfile };
