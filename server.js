/** @format */
require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const corsOptions = require('./config/corsOption');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 3000;

//Connect to mongoDB
connectDB();

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// ‘content-type: application/x-www-form-urlencoded’
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//handling routes
app.use('/register', require('./routes/api/register'));
app.use('/auth', require('./routes/api/auth'));
app.use('/refresh', require('./routes/api/refresh'));
app.use('/logout', require('./routes/api/logout'));

// Example protected route for testing JWT expiration/redirect
app.use('/liveskill', verifyJWT, (req, res) => {
	res.json({ message: 'You have access to a protected route!' });
});

mongoose.connection.once('open', () => {
	console.log('Connected to mongoDB');
	app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
