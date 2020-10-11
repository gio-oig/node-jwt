const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../validation');

const User = require('../models/userModel');

router.post('/register', async (req, res) => {
	// validate the data before we create user
	const { error } = registerValidation(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	// check if the user email is already in the database
	const userExists = await User.findOne({ email: req.body.email });
	if (userExists)
		return res.status(400).send('user already exists with this email');

	// Hash password
	const salt = await bcrypt.genSalt();
	const hashedPassword = await bcrypt.hash(req.body.password, salt);
	// res.send(hashedPassword);
	const user = new User({
		name: req.body.name,
		email: req.body.email,
		password: hashedPassword,
	});

	try {
		const createdUser = await user.save();
		res.json(createdUser);
	} catch (error) {
		res.status(400).send(error);
	}
});

router.post('/login', async (req, res) => {
	// validate the date
	const { error } = loginValidation(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	// check if user exists
	const user = await User.findOne({ email: req.body.email });
	if (!user) return res.status(400).send('Email is not found');

	const validpassword = await bcrypt.compare(req.body.password, user.password);
	console.log(validpassword);
	if (!validpassword) return res.status(400).send('Invalid password');

	// create and assign a toket
	const token = jwt.sign({ _id: user.id }, process.env.TOKEN_SECRET);
	res.header('auth-token', token).send(token);
});

router.get('/io', (req, res) => {
	res.json('working yeeaaaaaa');
});
module.exports = router;
