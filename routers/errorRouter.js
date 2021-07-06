const express = require('express');
const ErrorController = require('../controllers/errorController');
const router = express.Router();

router.use(ErrorController.unknownRoute);

router.use(ErrorController.allErrorHandler);

module.exports = router;