/** @format */

const express = require('express');
const router = express.Router();
const { handleEmailUpdate } = require('../../controllers/emailUpdate');

router.post('/', handleEmailUpdate);

module.exports = router;
