const Course = require('../models/Course');
const Chapter = require('../models/Chapter');
const User = require('../models/User');
const Progress = require('../models/Progress');

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private/Mentor
// @desc    Create a new course
// @route   POST /api/courses
// @access  Private/Mentor
const createCourse = async (req, res) => {
    const { title, description, image, initialStudentEmail } = req.body;

    let students = [];
    if (initialStudentEmail) {
        const student = await User.findOne({ email: initialStudentEmail });
        if (student && student.role === 'student') {
            students.push(student._id);
        }
    }

    const course = new Course({
        title,
        description,
        image: image || 'https://via.placeholder.com/300',
        mentor: req.user._id,
        students,
    });

    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
};

// @desc    Get mentor courses
// @route   GET /api/courses/my
// @access  Private/Mentor
const getMyCourses = async (req, res) => {
    const courses = await Course.find({ mentor: req.user._id });
    res.json(courses);
};

// @desc    Get all courses (Admin)
// @route   GET /api/courses
// @access  Private/Admin
const getAllCourses = async (req, res) => {
    const courses = await Course.find({}).populate('mentor', 'name email');
    res.json(courses);
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Mentor/Admin
const updateCourse = async (req, res) => {
    const course = await Course.findById(req.params.id);

    if (course) {
        if (req.user.role !== 'admin' && course.mentor.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to update this course' });
        }

        course.title = req.body.title || course.title;
        course.description = req.body.description || course.description;

        const updatedCourse = await course.save();
        res.json(updatedCourse);
    } else {
        res.status(404).json({ message: 'Course not found' });
    }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Mentor/Admin
const deleteCourse = async (req, res) => {
    const course = await Course.findById(req.params.id);

    if (course) {
        if (req.user.role !== 'admin' && course.mentor.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete this course' });
        }

        await course.deleteOne();
        await Chapter.deleteMany({ course: course._id }); // Cascade delete chapters
        res.json({ message: 'Course removed' });
    } else {
        res.status(404).json({ message: 'Course not found' });
    }
};

// @desc    Assign course to student
// @route   POST /api/courses/:id/assign
// @access  Private/Mentor
const assignCourse = async (req, res) => {
    const { email } = req.body;
    const course = await Course.findById(req.params.id);

    if (course) {
        if (course.mentor.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Check if student exists by email
        const student = await User.findOne({ email });
        if (!student || student.role !== 'student') {
            return res.status(400).json({ message: 'Student not found with that email' });
        }

        if (!course.students.includes(student._id)) {
            course.students.push(student._id);
            await course.save();
        }

        res.json({ message: 'Student assigned', course });
    } else {
        res.status(404).json({ message: 'Course not found' });
    }
};

// @desc    Add chapter to course
// @route   POST /api/courses/:id/chapters
// @access  Private/Mentor
const addChapter = async (req, res) => {
    // ... existing addChapter logic ...
    // (Wait, I need to make sure I don't accidentally cut off simple replacements. I'll use target content carefully)
    // Actually, I can just replace the specific function blocks.
    const { title, description, videoUrl, sequenceOrder } = req.body;
    const course = await Course.findById(req.params.id);

    if (course) {
        if (course.mentor.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const chapter = new Chapter({
            course: course._id,
            title,
            description,
            videoUrl,
            sequenceOrder,
        });

        const createdChapter = await chapter.save();
        res.status(201).json(createdChapter);
    } else {
        res.status(404).json({ message: 'Course not found' });
    }
};

// @desc    Get course chapters
// @route   GET /api/courses/:id/chapters
// @access  Private/Mentor, Private/Student (Assigned)
const getChapters = async (req, res) => {
    const course = await Course.findById(req.params.id);

    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Check access
    if (req.user.role === 'mentor' && course.mentor.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
    }
    if (req.user.role === 'student' && !course.students.includes(req.user._id)) {
        return res.status(403).json({ message: 'Not enrolled in this course' });
    }

    const chapters = await Chapter.find({ course: req.params.id }).sort({ sequenceOrder: 1 });
    res.json(chapters);
};

// @desc    Update chapter
// @route   PUT /api/courses/:id/chapters/:chapterId
// @access  Private/Mentor
const updateChapter = async (req, res) => {
    const { title, description, videoUrl, sequenceOrder } = req.body;
    const course = await Course.findById(req.params.id);

    if (course) {
        if (course.mentor.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const chapter = await Chapter.findById(req.params.chapterId);
        if (chapter) {
            chapter.title = title || chapter.title;
            chapter.description = description || chapter.description;
            chapter.videoUrl = videoUrl || chapter.videoUrl;
            chapter.sequenceOrder = sequenceOrder || chapter.sequenceOrder;

            const updatedChapter = await chapter.save();
            res.json(updatedChapter);
        } else {
            res.status(404).json({ message: 'Chapter not found' });
        }
    } else {
        res.status(404).json({ message: 'Course not found' });
    }
};

// @desc    Get courses assigned to student
// @route   GET /api/courses/student
// @access  Private/Student
const getStudentCourses = async (req, res) => {
    const courses = await Course.find({ students: req.user._id }).populate('mentor', 'name');

    const coursesWithProgress = await Promise.all(courses.map(async (course) => {
        const chapterCount = await Chapter.countDocuments({ course: course._id });
        const progress = await Progress.findOne({ student: req.user._id, course: course._id });
        const completedCount = progress ? progress.completedChapters.length : 0;
        const percent = chapterCount === 0 ? 0 : Math.round((completedCount / chapterCount) * 100);

        return {
            ...course.toObject(),
            totalChapters: chapterCount,
            completedChapters: completedCount,
            progress: percent,
        };
    }));

    res.json(coursesWithProgress);
};

// @desc    Get students enrolled in a course with progress
// @route   GET /api/courses/:id/students
// @access  Private/Mentor/Admin
const getEnrolledStudents = async (req, res) => {
    const course = await Course.findById(req.params.id);

    if (course) {
        if (req.user.role !== 'admin' && course.mentor.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const chapterCount = await Chapter.countDocuments({ course: course._id });

        // Get detailed student info and their progress
        const studentsData = await Promise.all(course.students.map(async (studentId) => {
            const student = await User.findById(studentId).select('name email');
            if (!student) return null;

            const progress = await Progress.findOne({ student: studentId, course: course._id });
            const completedCount = progress ? progress.completedChapters.length : 0;
            const percent = chapterCount === 0 ? 0 : Math.round((completedCount / chapterCount) * 100);

            return {
                _id: student._id,
                name: student.name,
                email: student.email,
                completedChapters: completedCount,
                totalChapters: chapterCount,
                progress: percent,
            };
        }));

        res.json(studentsData.filter(s => s !== null));
    } else {
        res.status(404).json({ message: 'Course not found' });
    }
};

module.exports = {
    createCourse,
    getMyCourses,
    updateCourse,
    deleteCourse,
    assignCourse,
    addChapter,
    getChapters,
    getStudentCourses,
    updateChapter,
    getEnrolledStudents,
    getAllCourses,
};
