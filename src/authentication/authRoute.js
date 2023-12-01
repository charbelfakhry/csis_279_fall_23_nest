const express = require('express');
const { authenticateController } = require('./authController');
const router = express.Router();

// Route for login which calls the authenticateController.
router.post('/authenticate', authenticateController);

module.exports = router;