const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config({ path: './.env' });

connectDB();

const approveAllMentors = async () => {
    try {
        const result = await User.updateMany(
            { role: 'mentor', isApproved: false },
            { $set: { isApproved: true } }
        );
        console.log(`Approved ${result.modifiedCount} mentors.`);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

approveAllMentors();
