const Progress = require('../models/Progress');
const Course = require('../models/Course');
const Chapter = require('../models/Chapter');

// @desc    Mark chapter as completed
// @route   POST /api/progress/:chapterId/complete
// @access  Private/Student
const completeChapter = async (req, res) => {
    const chapter = await Chapter.findById(req.params.chapterId);

    if (!chapter) {
        return res.status(404).json({ message: 'Chapter not found' });
    }

    // Find progress for this student and course
    let progress = await Progress.findOne({
        student: req.user._id,
        course: chapter.course,
    });

    if (!progress) {
        // Check if enrolled
        const course = await Course.findById(chapter.course);
        if (!course.students.includes(req.user._id)) {
            return res.status(403).json({ message: 'Not enrolled in this course' });
        }
        // Create new progress record
        progress = new Progress({
            student: req.user._id,
            course: chapter.course,
            completedChapters: [],
        });
    }

    // Check if already completed
    if (progress.completedChapters.includes(chapter._id)) {
        return res.status(200).json({ message: 'Chapter already completed' });
    }

    // Check strict sequence
    // Get all chapters for the course sorted by sequence
    const allChapters = await Chapter.find({ course: chapter.course }).sort({ sequenceOrder: 1 });

    const completedIds = progress.completedChapters.map(id => id.toString());

    // Find current chapter index
    const currentIndex = allChapters.findIndex(c => c._id.toString() === chapter._id.toString());

    // Previous chapter must be completed
    if (currentIndex > 0) {
        const prevChapter = allChapters[currentIndex - 1];
        if (!completedIds.includes(prevChapter._id.toString())) {
            return res.status(400).json({ message: 'Previous chapter not completed. Strict sequence enforced.' });
        }
    }

    progress.completedChapters.push(chapter._id);
    await progress.save();

    res.json({ message: 'Chapter completed', progress });
};

// @desc    Get my progress
// @route   GET /api/progress/my
// @access  Private/Student
const getMyProgress = async (req, res) => {
    const progress = await Progress.find({ student: req.user._id }).populate('course', 'title');
    res.json(progress);
};

// @desc    Get progress for specific course
// @route   GET /api/progress/:courseId
// @access  Private/Student
const getCourseProgress = async (req, res) => {
    const progress = await Progress.findOne({ student: req.user._id, course: req.params.courseId });

    if (!progress) {
        return res.json({ completedChapters: [] });
    }
    res.json(progress);
}

module.exports = { completeChapter, getMyProgress, getCourseProgress };
