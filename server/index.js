import express from 'express';
import logger from 'morgan';
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import { validateMessage } from './messageValidator.js';
import { broadcastMessage } from './broadcast.js';
import test from 'node:test';

const PORT = process.env.PORT ?? 3000;
const connectedUsers =new Map()

const app = express();
const server = createServer(app);
const io = new Server(server, {
    connectionStateRecovery:{}
});

const messageHistory = []

// EVENTOS
io.on('connection', (socket) => {
    // Asignamos un nombre random al usuario al conectarse
    const username = `User${Math.floor(Math.random() * 1000)}`;
    socket.userData = { username }
    console.log(`${username} se ha conectado`)

    // Historial de mensajes
    socket.emit('chat history', messageHistory)

    connectedUsers.set(socket.id, socket)
    console.log('Usuarios conectados:', connectedUsers.size)

    socket.on('disconnect', () => {
        connectedUsers.delete(socket.id)
        //console.log('Usuarios conectados:', connectedUsers.size)
        if (process.env.NODE_ENV !== 'test') {
        console.log('Usuarios conectados:', connectedUsers.size)
        }
    })

    socket.on('chat message', (msg) => {
        if (validateMessage(msg)) {
            const messageData = { text: msg, username: socket.userData.username}
            messageHistory.push(messageData)

            // Enviamos a todos
            broadcastMessage(connectedUsers, messageData, socket.id)
        }
    });

});

// Middleware que devuelve info en consola de una peticion(logs).
app.use(logger('dev'));


app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/client/index.html')
});


/*server.listen(PORT, () => {
    console.log('Servidor corriendo en http://localhost:3000')
});*/


if (process.env.NODE_ENV !== 'test') {
    server.listen(PORT, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
}

//module.exports = { server };