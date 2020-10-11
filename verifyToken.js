const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
	// check if token in in header and get it's value
	const token = req.header('auth-token');
	if (!token) return res.status(401).send('Access Denied');

	try {
		// verify returns user id saved in token
		const verified = jwt.verify(token, process.env.TOKEN_SECRET);
		// set user id inside request object
		req.user = verified;
		next();
	} catch (error) {
		res.status(400).send('Invalid Token');
	}
};

module.exports = auth;
