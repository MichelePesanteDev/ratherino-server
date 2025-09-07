const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (message) => {
        const text = message.toString();
        console.log('Raw message:', text);

        try {
            const data = JSON.parse(text);
            console.log('Parsed object:', data);

            if (data.key === 'startMatch') {
                wss.clients.forEach((client) => {
                    if (client.readyState === client.OPEN) {
                        client.send('Il topic scelto è: ' + data.topic);
                        client.send('La scelta 1 è: ' + data.firstChoice);
                        client.send('La scelta 2 è: ' + data.secondChoice);
                    }
                });
            }
        } catch (err) {
            console.error('Messaggio non in formato JSON:', err);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});