/** @format */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmailSchema = new Schema({
	email: {
		required: true,
		type: String,
	},
});

module.exports = mongoose.model('EmailUpdate', EmailSchema);
