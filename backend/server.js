const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.get('/api/test', (req, res) => {
    res.json({ message: 'Works', time: Date.now() });
});

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);
const courseRoutes = require('./routes/courseRoutes');
app.use('/api/courses', courseRoutes);
const progressRoutes = require('./routes/progressRoutes');
app.use('/api/progress', progressRoutes);
const certificateRoutes = require('./routes/certificateRoutes');
app.use('/api/certificates', certificateRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
