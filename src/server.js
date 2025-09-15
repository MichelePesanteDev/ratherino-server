const WebSocket = require("ws");
const url = require("url");

const wss = new WebSocket.Server({ port: 8080 });

// roomId → Set di client WebSocket
const rooms = new Map();

wss.on("connection", (ws, req) => {
  // Estraggo roomId dalla query string
  const query = url.parse(req.url, true).query;
  const roomId = query.roomId;

  if (!roomId) {
    console.log("Connessione rifiutata: manca roomId");
    ws.close();
    return;
  }

  console.log(`Nuovo client connesso alla stanza: ${roomId}`);

  // Aggiungo client alla stanza
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set());
  }
  rooms.get(roomId).add(ws);

  // Messaggio di benvenuto al client
  ws.send(JSON.stringify({ key: "welcome", roomId }));

  // Gestione messaggi ricevuti
  ws.on("message", (message) => {
    const text = message.toString();
    console.log(`Raw message da stanza ${roomId}:`, text);

    try {
      const data = JSON.parse(text);
      console.log("Parsed object:", data);

      if (data.key === "updateInfo") {
        // Invia solo ai client nella stessa stanza
        rooms.get(roomId).forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            console.log(`Invio a client in stanza ${roomId}:`, data);
            client.send(JSON.stringify(data));
          }
        });
      }
    } catch (err) {
      console.error("Messaggio non in formato JSON:", err);
    }
  });

  // Gestione disconnessione
  ws.on("close", () => {
    console.log(`Client disconnesso dalla stanza: ${roomId}`);
    if (rooms.has(roomId)) {
      rooms.get(roomId).delete(ws);
      if (rooms.get(roomId).size === 0) {
        rooms.delete(roomId);
        console.log(`Stanza ${roomId} eliminata (vuota)`);
      }
    }
  });
});

console.log("Server WebSocket avviato su ws://localhost:8080");
