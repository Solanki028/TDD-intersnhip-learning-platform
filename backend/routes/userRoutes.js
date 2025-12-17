const express = require('express');
const router = express.Router();
const { getUsers, deleteUser, approveMentor, getAnalytics, updatePassword, createUser, toggleUserStatus } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, authorize('admin'), getUsers)
    .post(protect, authorize('admin'), createUser);

router.route('/:id')
    .delete(protect, authorize('admin'), deleteUser);

router.route('/:id/toggle-status')
    .put(protect, authorize('admin'), toggleUserStatus);

router.route('/:id/approve-mentor')
    .put(protect, authorize('admin'), approveMentor);

router.route('/analytics')
    .get(protect, authorize('admin'), getAnalytics);

router.route('/profile/password')
    .put(protect, updatePassword);

module.exports = router;
