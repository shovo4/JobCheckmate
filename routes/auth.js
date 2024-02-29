const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getUserProfile,
  getAllUsers,
  deleteUserByEmail
} = require('../controllers/auth');
const authenticateUser = require('../middleware/authentication'); // Ensure this is the correct path

router.post('/register', register);
router.post('/login', login);
router.get('/profile/:id', authenticateUser, getUserProfile);
router.get('/allUsers', authenticateUser, getAllUsers);
router.delete('/delete/:email', deleteUserByEmail);

module.exports = router;
