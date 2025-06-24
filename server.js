// server.js
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Servir arquivos estáticos (index.html fica na pasta public)
app.use(express.static(path.join(__dirname, 'public')));

wss.on('connection', function connection(ws) {
  console.log('Cliente conectado');

  ws.on('message', function incoming(message) {
    // Garantir que estamos trabalhando com texto
    const msg = message.toString();
    console.log('Recebido:', msg);

    // Enviar mensagem para todos os clientes conectados
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(msg);
      }
    });
  });

  ws.on('close', () => {
    console.log('Cliente desconectado');
  });
});

// Iniciar servidor
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
