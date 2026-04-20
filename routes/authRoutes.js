const express = require('express');
const router = express.Router();

// 👇 Notice getAllUsers is imported here!
const { registerUser, loginUser, getMe, getAllUsers,updateUser,updateProfile,deleteUser} = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
// ── NEW: Route to fetch all users ────────────────────────
router.get('/users', protect, getAllUsers);
// ── NEW: Route to update a user ────────────────────────
router.put('/users/:id', protect, updateUser);
router.delete('/users/:id', protect, admin, deleteUser);

module.exports = router;