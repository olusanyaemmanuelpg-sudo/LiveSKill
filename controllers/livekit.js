/** @format */

const { AccessToken } = require('livekit-server-sdk');

const createToken = async (userId, roomName, isHost = false) => {
	const at = new AccessToken(
		process.env.LIVEKIT_API_KEY,
		process.env.LIVEKIT_API_SECRET,
		{ identity: String(userId) },
	);

	at.addGrant({
		roomJoin: true,
		room: roomName,
		canPublish: isHost, // only creator can stream
		canSubscribe: true, // everyone can watch
	});

	return await at.toJwt();
};

const liveStreams = new Map();

module.exports = { createToken, liveStreams };
