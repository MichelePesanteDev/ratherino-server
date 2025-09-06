const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (message) => {
        console.log('Received:', message);
        if (message.key === 'topic') {
            wss.clients.forEach((client) => {
                if (client.readyState === client.OPEN) {
                    client.send('Il topic scelto è: ' + message.body);
                }
            });
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});