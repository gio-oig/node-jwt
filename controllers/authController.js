const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { registerValidation, loginValidation } = require('../validation');
const HttpError = require('../routes/http-error');

// models
const User = require('../models/userModel');
// middlewares
const fileUpload = require('../middleware/file-upload');

const registerUser = async (req, res, next) => {
	// validate the data before we create user
	const { error } = registerValidation(req.body);
	if (error) return next(new HttpError(error.details[0].message, 400));

	// check if the user email is already in the database
	const userExists = await User.findOne({ email: req.body.email });
	if (userExists)
		return next(new HttpError('user already exists with this email', 400));

	// Hash password
	const salt = await bcrypt.genSalt();
	const hashedPassword = await bcrypt.hash(req.body.password, salt);
	// res.send(hashedPassword);
	const user = new User({
		name: req.body.name,
		email: req.body.email,
		password: hashedPassword,
	});

	let createdUser;
	try {
		createdUser = await user.save();
	} catch (error) {
		return next(new HttpError('Logging in faild, please try later', 500));
	}
	res.json(createdUser);
};

const loginUser = async (req, res, next) => {
	// validate the date
	const { error } = loginValidation(req.body);
	if (error) return next(new HttpError(error.details[0].message, 400));

	const { email, password } = req.body;

	// check if user exists
	const user = await User.findOne({ email });
	if (!user) return next(new HttpError('Email is not found', 400));

	// validate hashed password
	const validpassword = await bcrypt.compare(password, user.password);
	if (!validpassword) return next(new HttpError('Invalid password', 400));

	// create and assign a toket
	const token = jwt.sign({ _id: user.id }, process.env.TOKEN_SECRET);
	res.header('auth-token', token).json({ message: 'logged in' });
};

module.exports = {
	registerUser,
	loginUser,
};
