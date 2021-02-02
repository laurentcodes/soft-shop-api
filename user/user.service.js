const config = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');

const { validationResult } = require('express-validator');

const User = db.User;

// Get all Users
const getUsers = async () => {
	try{
		const users = await User.find();
			return users;
	} catch (err) {
		return err
	}
	
};

// Register User
const registerUser = async (userParam) => {

	const { first_name, last_name, email, phone_number, password } = userParam;

	try {
		let user = await User.findOne({ email });

		if (user) {
			// return res
			// 	.status(400)
			// 	.json({ msg: 'User with this email already exists' });
			throw 'User with this email already exists' 
		}

		// Create User Object
		user = new User({
			first_name,
			last_name,
			email,
			phone_number,
			password,
		});

		const salt = await bcrypt.genSalt(10);

		// Replace password from user object with encrypted one
		user.password = await bcrypt.hash(password, salt);

		// Save user to db
		await user.save();

		// Define payload for token
		const payload = {
			user: {
				id: user.id,
			},
		};

		// Generate and return token to server
		const token = jwt.sign(payload, config.jwtSecret, { expiresIn: 36000 });
		return token;

		// return res.status(200).json({ user });
	} catch (err) {
		// console.error(err);
		return err;
	}
};

// Login User
const loginUser = async (loginParam) => {

	const { email, password } = loginParam;

	try {
		// Find user with email
		let user = await User.findOne({ email });

		if (!user) {
			throw 'Invalid Credentials';
		}

		// Check if password matches with stored hash
		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			throw 'Invalid Credentials' ;
		}

		// Define payload for token
		const payload = {
			user: {
				id: user.id,
			},
		};

		// Generate and return token to server
		const token = jwt.sign(payload, config.jwtSecret, { expiresIn: 36000 });
		if(!token){
			throw 'missing token' ;
		}
		return token;

	} catch (err) {
		return err ;
	}
};

// Get Logged in User
const getLoggedInUser = async (userParam) => {
	console.log('running')
	try {
		const user = await User.findById(userParam).select('-password');
		console.log(user)
		return user;
	} catch (err) {
		// console.error(err.message);
		return err;
	}
};

// Update User Details
const updateUser = async (updateParam,id) => {
	console.log(updateParam,id)
	const { address, password, email } = updateParam;

	// Build User Object
	const userFields = {};

	// Check for fields
	if (address) userFields.address = address;
	if (email) userFields.email = email;
	if (password) {
		const salt = await bcrypt.genSalt(10);

		// Replace password from user object with encrypted one
		userFields.password = await bcrypt.hash(password, salt);
	}

	try {
		// Find use from DB Collection
		let user = await User.findById(id);
		

		if (!user) throw 'User not found';

		// Check if address field is not empty
		if (address !== '' || null) {
			// Check if address array is not empty
			if (!user.address.length < 1) {
				// Set the address value in user object to address found from db, then append new address
				userFields.address = [...user.address, address];
			}
		}

		// Updates the user Object with the changed values
		user = await User.findByIdAndUpdate(
			id,
			{ $set: userFields },
			{ new: true, useFindAndModify: true }
		);

		throw user;
	} catch (err) {
		return err
	}
};

module.exports = {
	getUsers,
	registerUser,
	loginUser,
	getLoggedInUser,
	updateUser,
};
