import express from 'express';
import { check } from 'express-validator';

const router = express.Router();

import {
	getAdmins,
	registerAdmin,
	loginAdmin,
	getLoggedInAdmin,
	updateAdmin,
} from '../controllers/admin.controller.js';

import { auth } from '../middleware/auth.js';

// @route   GET /admin
// @desc    Get all Admin Users
// @access  Public
router.get('/', auth, getAdmins);

// @route   POST admin/register
// @desc    Register an Admin account
// @access  Public
router.post(
	'/register',
	[
		check('username', 'Please Enter Username').not().isEmpty(),
		check(
			'password',
			'Please Enter Password with 6 or more characters'
		).isLength({ min: 6 }),
	],
	registerAdmin
);

// @route   POST admins/login
// @desc    Login a User & get token
// @access  Public
router.post(
	'/login',
	[
		check('username', 'Please enter a Username').exists(),
		check('password', 'Password should be 6 characters or more').isLength({
			min: 6,
		}),
		check('password', 'Password is Required').exists(),
	],
	loginAdmin
);

// @route   GET admins/login
// @desc    Get logged in user
// @access  Private
router.get('/login', auth, getLoggedInAdmin);

// @route   PUT admins/:id
// @desc    Update User Details
// @access  Private
router.put('/', auth, updateAdmin);

export default router;
