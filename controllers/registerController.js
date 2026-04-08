/** @format */

const User = require('../model/User');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
	const { user, pwd, email } = req.body;
	if (!user || !pwd || !email)
		return res
			.status(400) //not found
			.json({ message: 'Username, email, and password are required' });
	const duplicate = await User.findOne({ username: user, email: email }).exec();
	if (duplicate) return res.sendStatus(409); // conflict
	try {
		//encrypt the password
		const hashedPwd = await bcrypt.hash(pwd, 10);
		//store the user
		const result = await User.create({
			username: user,
			password: hashedPwd,
			email: email,
		});
		console.log(result);

		res.status(200).json({ success: `New user ${user} created` });
	} catch (err) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = { handleNewUser };
