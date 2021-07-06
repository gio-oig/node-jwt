const fs = require('fs');
const HttpError = require('../utils/http-error');


const unknownRoute = (req, res, next) => {
	return next(new HttpError('Could not find this route'));
}

const allErrorHandler = (error, req, res, next) => {
	// delete image if we got an error
	// multer adds file property to request object
	if (req.file) {
		fs.unlink(req.file.path, (err) => console.log(err));
	}
	res.status(error.code || 500);
	res.json({
		message: error.message,
		stack: error.stack,
	});
}

module.exports = {
    unknownRoute,
    allErrorHandler
}