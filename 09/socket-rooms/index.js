const express = require('express');
const http = require('http');
const socket = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socket(server);

const host = '127.0.0.1';
const port = 3000;

const adminsNameSpace = io.of('/admins');
const usersNameSpace = io.of('/users');

adminsNameSpace.on('connection', (socket) => {
    const socketId = socket.id;

    console.log('SOCKET', socket);

    console.log(`Client with socket id: ${socketId} was connected to /admins`);

    socket.emit('message', 'I am a server');

    socket.on('message', (data) => {
        console.log('Client send', data);
    });

    socket.on('disconnect', () => {
        console.log(`Client with id ${socketId} was disconnected`);
    });

});

usersNameSpace.on('connection', (socket) => {
    const socketId = socket.id;

    console.log(`Client with socket id: ${socketId} was connected to /admins`);

    socket.emit('message', 'I am a server');

    socket.on('message', (data) => {
        console.log('Client:', data);
    });

    socket.on('disconnect', () => {
        console.log(`Client with id ${socketId} was disconnected`);
    });

});

app.use(express.static(__dirname));
app.use(express.json());

app.get('/', (req, res) => res.sendFile('index.html'));


server.listen(port, host, () => {
    console.log(`Server listens http://${host}:${port}`);
});
