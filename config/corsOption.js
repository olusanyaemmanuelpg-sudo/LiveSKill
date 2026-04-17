/** @format */

const whitelist = [
	'http://localhost:5173',
	'https://liveskill-frontend.onrender.com',
	'http://localhost:3000',
];
const corsOptions = {
	origin: (Origin, callback) => {
		if (whitelist.indexOf(Origin) !== -1 || !Origin) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
	optionsSuccessStatus: 200,
	credentials: true,
};

module.exports = corsOptions;
