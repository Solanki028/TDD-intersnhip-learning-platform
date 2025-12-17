const mongoose = require('mongoose');

const progressSchema = mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Course',
        },
        completedChapters: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Chapter',
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Progress = mongoose.model('Progress', progressSchema);

module.exports = Progress;
