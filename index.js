const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const dotenv = require('dotenv');

const authRoute = require('./routes/auth');
const postRoutes = require('./routes/postRoutes');

const app = express();
dotenv.config();

mongoose.connect(
	process.env.DB_CONNECT,
	{ useUnifiedTopology: true, useNewUrlParser: true },
	() => console.log('connected to db!')
);

app.use(morgan('common'));
app.use(express.json());

app.use('/api/user', authRoute);
app.use('/api/post', postRoutes);

app.listen(5000, () => console.log('server up and running'));
