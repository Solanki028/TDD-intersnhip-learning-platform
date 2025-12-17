const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, authorize('mentor'), createCourse)
    .get(protect, authorize('admin'), getAllCourses);

router.route('/my')
    .get(protect, authorize('mentor'), getMyCourses);

router.route('/student')
    .get(protect, authorize('student'), getStudentCourses);

router.route('/:id')
    .put(protect, authorize('mentor'), updateCourse)
    .delete(protect, authorize('mentor'), deleteCourse);

router.route('/:id/assign')
    .post(protect, authorize('mentor'), assignCourse);

router.route('/:id/chapters')
    .post(protect, authorize('mentor'), addChapter)
    .get(protect, getChapters);

router.route('/:id/chapters/:chapterId')
    .put(protect, authorize('mentor'), updateChapter);

router.route('/:id/students')
    .get(protect, authorize('mentor'), getEnrolledStudents);

module.exports = router;
