const express = require('express');
const router = express.Router();
const { getUsers, deleteUser, approveMentor, getAnalytics } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, authorize('admin'), getUsers);

router.route('/:id')
    .delete(protect, authorize('admin'), deleteUser);

router.route('/:id/approve-mentor')
    .put(protect, authorize('admin'), approveMentor);

router.route('/analytics')
    .get(protect, authorize('admin'), getAnalytics);

module.exports = router;
