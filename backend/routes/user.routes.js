const express = require('express');
const router = express.Router();
const { create } = require('../controllers/user.controller');

router.post('/auth/register', create);

module.exports = router;