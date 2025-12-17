const mongoose = require('mongoose');

const chapterSchema = mongoose.Schema(
    {
        course: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Course',
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        videoUrl: {
            type: String,
            required: true,
        },
        sequenceOrder: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Chapter = mongoose.model('Chapter', chapterSchema);

module.exports = Chapter;
