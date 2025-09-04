import WebSocket from 'ws';

const socket = new WebSocket('ws://localhost:8080');

socket.on('open', function () {
    console.log('Connected to the server');
    socket.send('Hello Server!');
});

socket.on('message', function (message) {
    console.log('Received from server:', message);
});

socket.on('close', function () {
    console.log('Disconnected from the server');
});