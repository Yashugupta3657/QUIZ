const express = require('express');
const http = require('http');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');
const gameSocket = require('./socket/gameSocket');
const { Server } = require("socket.io");
const cors = require("cors");
require('dotenv').config();

connectDB();
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
app.use(cors());

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);

gameSocket(io);

server.listen(5000, () => console.log('Server running on port 5000'));
