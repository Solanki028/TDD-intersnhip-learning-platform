const express = require('express');
const router = express.Router();
const { generateCertificate } = require('../controllers/certificateController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/:courseId')
    .get(protect, authorize('student'), generateCertificate);

module.exports = router;
