const express = require('express');
const http = require('http');
const socket = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socket(server);

const host = '127.0.0.1';
const port = 3000;

const clients = [];


io.on('connection', (socket) => {

    const socketId = socket.id;

    console.log(`Client with socket id: ${socketId} was connected`);

    clients.push(socketId);

    socket.emit('message', 'I am a server');

    socket.on('message', (data) => {
        console.log('Message', data);
    });

    socket.on('disconnect', () => {
        clients.splice(clients.indexOf(socketId), 1);

        console.log(`Client with id ${socketId} was disconnected`);
    });

});

app.use(express.static(__dirname));
app.use(express.json());

app.get('/', (req, res) => res.sendFile('index.html'));


app.post('/clients/:id', (req, res) => {
    const socketId = req.params.id;

    const { message } = req.body;

    if (clients.indexOf(socketId !== -1)) {
        io.sockets.connected[socketId].emit('private message', `${message} to client id: ${socketId}`);

        return res.send({ message: `Message was send to client with id: ${socketId}` });
    } else {
        return req.status(404).send({ message: 'Client was not found' });
    }
});

app.get('/clients-count', (req, res) => {
    console.log(io);

    res.send({
        clients: io.clients().server.engine.clientsCount
    })
});


server.listen(port, host, () => {
    console.log(`Server listens http://${host}:${port}`);
});
