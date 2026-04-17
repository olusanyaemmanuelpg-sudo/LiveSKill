/** @format */

const EmailUpdate = require('../model/EmailUpdate');

const handleEmailUpdate = async (req, res) => {
	const { emailUpdate } = req.body;
	if (!emailUpdate) return res.sendStatus(401);

	const result = await EmailUpdate.create({ email: emailUpdate });
	console.log(result);

	res.status(200).json({ success: 'Thanks for choosing us' });
};

module.exports = { handleEmailUpdate };
