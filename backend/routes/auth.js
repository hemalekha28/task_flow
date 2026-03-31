const express = require('express');
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
console.log('AUTH MIDDLEWARE LOADED:', Object.keys(auth));
console.log('REGISTER HANDLER TYPE:', typeof authController.register);

const router = express.Router();

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  '/register',
  authController.register
);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/login',
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
  authController.login
);

// @route   POST api/auth/logout
// @desc    Logout user / clear token
// @access  Private
router.post('/logout', auth.protect, authController.logout);

// @route   GET api/auth/me
// @desc    Get current logged in user
// @access  Private
router.get('/me', auth.protect, authController.getMe);

// @route   PUT api/auth/updatedetails
// @desc    Update user details
// @access  Private
router.put(
  '/updatedetails',
  auth.protect,
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  authController.updateDetails
);

// @route   PUT api/auth/updatepassword
// @desc    Update password
// @access  Private
router.put(
  '/updatepassword',
  auth.protect,
  check('currentPassword', 'Current password is required').not().isEmpty(),
  check('newPassword', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  authController.updatePassword
);

module.exports = router;
