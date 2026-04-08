/** @format */

const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
	const authHeader = req.headers.authorization || req.headers.Authorization;
	if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);

	//split on space to seprate "Bearer"  and the token
	const token = authHeader.split(' ')[1];
	if (!token || token === null || token === undefined)
		return res.sendStatus(401);

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
		if (err) return res.sendStatus(401); //invalid or expired token
		req.user = decoded.userInfo.username;
		req.roles = decoded.userInfo.roles;
		next();
	});
};

module.exports = verifyJWT;
