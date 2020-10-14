const router = require('express').Router();
const auth = require('../verifyToken');

router.get('/', auth, (req, res) => {
	// res.json({
	// 	posts: {
	// 		title: 'some random post title',
	// 		description: 'It must be a good post',
	// 	},
	// });
	res.json(req.user);
});

module.exports = router;
