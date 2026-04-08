/** @format */

const User = require('../model/User');

const handleLogout = async (req, res) => {
	//on Client, also delete the accesToken

	const cookies = req.cookies;
	if (!cookies?.jwt) return res.sendStatus(204); //No content

	const refreshToken = cookies.jwt;
	//is refreshToken in db
	const foundUser = await User.findOne({ refreshToken: refreshToken }).exec();
	if (!foundUser) {
		res.clearCookie('jwt', { httpOnly: true });
		return res.sendStatus(204);
	}

	//delete refreshToken in db {
	foundUser.refreshToken = ' ';
	const result = await foundUser.save();
	console.log(result);

	res.clearCookie('jwt', { httpOnly: true });
	res.sendStatus(204);
};

module.exports = { handleLogout };
