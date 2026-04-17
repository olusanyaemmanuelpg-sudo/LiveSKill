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

//for socket.io
const http = require('http');
const { Server } = require('socket.io');
const liveStreams = require('./controllers/livekit').liveStreams;

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
app.use('/email-update', require('./routes/api/emailUpdate'));

app.use('/livestream', require('./routes/api/livekitStream'));

// Public endpoint: fetch all currently active live streams
app.get('/live-streams', (req, res) => {
	const streams = Array.from(liveStreams.values());
	res.json(streams);
});

// Called when host ends stream — removes it from the active list
app.delete('/live-streams/:roomName', (req, res) => {
	liveStreams.delete(req.params.roomName);
	res.json({ success: true });
});

// Example protected route for testing JWT expiration/redirect
app.use(verifyJWT);

app.use('/liveskill', (req, res) => {
	res.json({ message: 'You have access to a protected route!' });
});

mongoose.connection.once('open', () => {
	console.log('Connected to mongoDB');

	const server = http.createServer(app);

	const io = new Server(server, {
		cors: {
			origin: 'http://localhost:5173',
			credentials: true,
		},
	});

	io.on('connection', (socket) => {
		console.log('User connected:', socket.id);

		socket.on('join-room', async (roomName) => {
			socket.join(roomName);

			// get number of users in room (fetchSockets returns an array)
			const clients = await io.in(roomName).fetchSockets();
			const count = clients.length;

			// broadcast updated count to everyone in the room
			io.to(roomName).emit('viewer-count', count);

			console.log(`Users in ${roomName}:`, count);
		});

		socket.on('send-message', ({ roomName, message, user }) => {
			io.to(roomName).emit('receive-message', {
				message,
				user,
				time: new Date(),
			});
		});

		socket.on('disconnecting', async () => {
			const rooms = [...socket.rooms]; // snapshot before leaving

			for (const roomName of rooms) {
				// Skip the socket's own private room
				if (roomName !== socket.id) {
					const clients = await io.in(roomName).fetchSockets();
					const count = clients.length - 1; // subtract the leaving user
					io.to(roomName).emit('viewer-count', count);
				}
			}
			console.log('User disconnected');
		});
	});

	server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
