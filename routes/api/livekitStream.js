/** @format */

const express = require('express');
const router = express.Router();
const { createToken } = require('../../controllers/livekit');

router.post('/', async (req, res) => {
	const { userId, roomName, role } = req.body;

	if (!userId || !roomName) {
		return res.status(400).json({ error: 'userId and roomName are required' });
	}

	const isHost = role === 'host';

	try {
		const token = await createToken(userId, roomName, isHost);
		res.json({ token });
	} catch (error) {
		console.error('Error creating token:', error);
		res.status(500).json({ error: 'Failed to create token' });
	}
});

module.exports = router;
