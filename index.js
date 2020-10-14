const fs = require('fs');
const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');

const HttpError = require('./routes/http-error');
const authRoute = require('./routes/auth');
const postRoutes = require('./routes/postRoutes');

const app = express();
dotenv.config();

mongoose.connect(
	process.env.DB_CONNECT,
	{ useUnifiedTopology: true, useNewUrlParser: true },
	() => console.log('connected to db!')
);

app.use(cors());
app.use(morgan('common'));
app.use(express.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use('/api/user', authRoute);
app.use('/api/post', postRoutes);

app.use((req, res, next) => {
	return next(new HttpError('Could not find this route'));
});

app.use((error, req, res, next) => {
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
});

app.listen(5000, () => console.log('server up and running'));
