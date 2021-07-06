const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');

const authRouter = require('./routers/auth');
const authorize = require('./middleware/authorize');
const role = require('./utils/role');

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

app.use('/api/user', authRouter);


app.use('/api/securedRoute',authorize(role.Admin), (req, res, next) => {
	console.log(req.user);
	console.log(req.headers);
	return res.send('oi')
})

app.use(require('./routers/errorRouter'))


app.listen(5000, () => console.log('server up and running'));
