/** @format */

const User = require('../model/User');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
	const { email, pwd } = req.body;
	if (!email || !pwd)
		return res
			.status(400)
			.json({ message: 'Email and password are required.' });
	const foundUser = await User.findOne({ email: email }).exec();
	if (!foundUser) return res.sendStatus(401);

	const match = await bcrypt.compare(pwd, foundUser.password);
	if (match) {
		const roles = Object.values(foundUser.roles);
		// create a JWT
		const accessToken = jwt.sign(
			{
				userInfo: {
					username: foundUser.username,
					roles: roles,
				},
			},
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: '15m' },
		);
		const refreshToken = jwt.sign(
			{ username: foundUser.username },
			process.env.REFRESH_TOKEN_SECRET,
			{ expiresIn: '1d' },
		);

		//saving refresh token with current user
		foundUser.refreshToken = refreshToken;
		const result = await foundUser.save();
		console.log(result);

		res.cookie('jwt', refreshToken, {
			httpOnly: true,
			/* secure: true, // use true in production (HTTPS)
			sameSite: 'None', // or 'Strict'/'Lax' depending on your setup */
			maxAge: 24 * 60 * 60 * 1000,
		});
		res.json({ accessToken });
	} else {
		res.sendStatus(401);
	}
};

module.exports = { handleLogin };
