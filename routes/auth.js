const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { registerValidation, loginValidation } = require('../validation');
const HttpError = require('../routes/http-error');

const authController = require('../controllers/authController');

// models
const User = require('../models/userModel');
// middlewares
const fileUpload = require('../middleware/file-upload');

// router.post('/register', fileUpload.single('image'),authController.registerUser)
router.post('/register', authController.registerUser);

router.post('/login', authController.loginUser);

router.get('/io', (req, res) => {
	res.json('working yeeaaaaaa');
});
module.exports = router;
