const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const seedAdmin = async () => {
    try {
        const adminEmail = 'admin@example.com';
        const adminExists = await User.findOne({ email: adminEmail });

        if (adminExists) {
            try {
                await User.deleteOne({ email: adminEmail });
                console.log('Existing admin deleted. Re-seeding...');
            } catch (err) {
                console.log("Error deleting admin: ", err.message);
            }
        }

        const adminUser = new User({
            name: 'Super Admin',
            email: adminEmail,
            password: 'adminpassword', // Will be hashed by pre-save hook
            role: 'admin',
            isApproved: true,
        });

        await adminUser.save();
        console.log('Admin user created successfully');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedAdmin();
