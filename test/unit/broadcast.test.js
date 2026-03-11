/**
 * Primera prueba unitaria: comprobamos que cuando enviamos un mensaje todos los sockets de los clientes reciben el mensaje.
 * Segunda Prueba Unitaria: comprobamos si un usuario esta mal conectado(le faltan datos) el servidor no tenga errores por un socket invalido.
 * Aca comporbamos que el servidor no debe fallar por un cliente invalido
 */

const { broadcastMessage } = require('../../server/broadcast.js')

describe('Test para broadcastMessage', () => {

    test('Cuando envio un mensaje todos los sockets reciben el mensaje', () => {
        // Creamos sockets falsos. jest.fn() crea una funcion falsa que no hace nada pero recuerda cuando fue llamada y con que datos.
        const socket1 = { emit: jest.fn() };
        const socket2 = { emit: jest.fn() };

        // Simulamos usuarios conectados
        const usersMap = new Map();
        usersMap.set('1', socket1);
        usersMap.set('2', socket2);

        // Creamos el mensaje
        const messageData = { text: 'Hola', username: 'User1'};

        // Enviamos el mensaje a cada usuario
        broadcastMessage(usersMap, messageData);

        // Verificamos que cada socket recibio el mensaje.
        expect(socket1.emit).toHaveBeenCalledWith('chat message', messageData);
        expect(socket2.emit).toHaveBeenCalledWith('chat message', messageData);
    });

    test('Si un usuario esta mal conectado o desaparece, el servidor no debe romperse', () => {
        const socket1 = { emit: jest.fn() };
        const usersMap = new Map();
        usersMap.set('1', socket1);
        usersMap.set('2', null); // socket faltante

        const messageData = { text: 'Hola', username: 'User1' };

        broadcastMessage(usersMap, messageData);

        expect(socket1.emit).toHaveBeenCalledWith('chat message', messageData);
        // el socket null se ignora no hay error
    });
})