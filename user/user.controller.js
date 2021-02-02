const express = require('express');
const router = express.Router();
const userService = require('./user.service');
const auth = require('../_helpers/auth');
const { check, validationResult } = require('express-validator');

// @route   GET /user
// @desc    Get all Users
// @access  Public
router.get('/', function getUsers(req, res, next) {
	// Call GetUsers function from userService
	userService.getUsers().then((users) =>
		users
			? res.json(users)
			: res
					.status(404)
					.json({ msg: 'User not found' })
					.catch((err) => next(err))
	);
});

// @route   POST user/register
// @desc    Register a User
// @access  Public
router.post(
	'/register',
	[
		check('first_name', 'Please Enter First Name').not().isEmpty(),
		check('last_name', 'Please Enter Last Name').not().isEmpty(),
		check('email', 'Please Enter Valid Email').isEmail(),
		check('phone_number', 'Please Enter Valid Phone Number').isMobilePhone(),
		check(
			'password',
			'Please Enter Password with 6 or more characters'
		).isLength({ min: 6 }),
	],
	function registerUser(req, res, next) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		// Call Register function from userService
		userService
			.registerUser(req.body)
			.then((result) => res.json(result))
			.catch((err) => next(err));
	}
);

// @route   POST user/login
// @desc    Login a User & get token
// @access  Public

router.post(
	'/login',
	[
		check('email', 'Please enter a Valid Email').isEmail(),
		check('password', 'Password should be 6 characters or more').isLength({
			min: 6,
		}),
		check('password', 'Password is Required').exists(),
	],
	function loginUser(req, res, next) {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		// Call Login function from userService
		userService
			.loginUser(req.body)
			.then((result) => res.json(result))
			.catch((err) => next(err));
	}
);

// @route   GET user/login
// @desc    Get logged in user
// @access  Private

router.get('/login', auth, function getLoggedInUser(req, res, next) {
	// Call Get Logged in User function from userService
	userService
		.getLoggedInUser(req.user.id)
		.then((loggedInUser) => res.json(loggedInUser))
		.catch((err) => next(err));
});

// @route   PUT user/:id
// @desc    Update User Details
// @access  Private

router.put('/update/:id', auth, function updateUser(req, res, next) {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	userService
		.updateUser(req.body, req.params.id)
		.then((user) => res.json(user))
		.catch((err) => next(err));
});

module.exports = router;
