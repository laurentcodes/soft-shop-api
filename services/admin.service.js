import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import Admin from '../models/admin.model.js';

const getAdmins = async () => {
	try {
		const admins = await Admin.find();

		if (admins.length > 0) {
			return admins;
		}
	} catch (err) {
		return err;
	}
};

const registerAdmin = async (params) => {
	const { username, password } = params;

	try {
		let admin = await Admin.findOne({ username });

		if (admin) {
			throw { err: 'Admin account already exists' };
		}

		// Create Admin Object
		admin = new Admin({
			username,
			password,
		});

		const salt = await bcrypt.genSalt(10);

		// Replace password from user object with encrypted one
		admin.password = await bcrypt.hash(password, salt);

		// Save user to db
		await admin.save();

		// Define payload for token
		const payload = {
			admin: {
				id: admin.id,
			},
		};

		// Generate and return token to server
		const token = jwt.sign(payload, process.env.JWT_SECRET, {
			expiresIn: 36000,
		});

		return token;
	} catch (err) {
		return err;
	}
};

const loginAdmin = async (loginParam) => {
	const { username, password } = loginParam;

	try {
		// Find admin with email
		let admin = await Admin.findOne({ username });

		if (!admin) {
			throw { err: 'Admin not found' };
		}

		// Check if password matches with stored hash
		const isMatch = await bcrypt.compare(password, admin.password);

		if (!isMatch) {
			throw { err: 'Wrong password' };
		}

		// Define payload for token
		const payload = {
			admin: {
				id: admin.id,
			},
		};

		// Generate and return token to server
		const token = jwt.sign(payload, process.env.JWT_SECRET, {
			expiresIn: 36000,
		});

		if (!token) {
			throw { err: 'Missing Token' };
		}

		return token;
	} catch (err) {
		console.log(err);
		return err;
	}
};

const getLoggedInAdmin = async (adminParam) => {
	try {
		const admin = await Admin.findById(adminParam).select('-password');

		return admin;
	} catch (err) {
		return err;
	}
};

const updateAdmin = async (updateParam, id) => {
	const { username, password } = updateParam;

	// Build Admin Object
	const adminFields = {};

	// Check for fields
	if (username) adminFields.username = username;
	if (password) {
		const salt = await bcrypt.genSalt(10);

		// Replace password from admin object with encrypted one
		adminFields.password = await bcrypt.hash(password, salt);
	}

	try {
		// Find admin from DB Collection
		let admin = await Admin.findById(id);

		if (!admin) throw { msg: 'Admin not found' };

		// Updates the admin Object with the changed values
		admin = await Admin.findByIdAndUpdate(
			id,
			{ $set: adminFields },
			{ omitUndefined: true, new: true, useFindAndModify: false }
		);

		return admin;
	} catch (err) {
		return err;
	}
};

export { getAdmins, registerAdmin, loginAdmin, getLoggedInAdmin, updateAdmin };
