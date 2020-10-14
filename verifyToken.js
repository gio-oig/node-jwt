const jwt = require('jsonwebtoken');

const HttpError = require('./routes/http-error');

const auth = (req, res, next) => {
	// check if token in in header and get it's value
	const token = req.header('auth-token');
	if (!token) return next(new HttpError('Access Denied', 401));

	try {
		// verify returns user id saved in token
		const verified = jwt.verify(token, process.env.TOKEN_SECRET);
		// set user id inside request object
		req.user = verified;
	} catch (error) {
		return next(new HttpError('Invalid Token', 400));
	}
	next();
};

module.exports = auth;
