/**
 * Esta prueba de integracion verifica cuando un cliente envia un mensaje a otro cliente conectado, lo reciba correctamente.
 * Comprobamos que toda la comunicacion funcione  
 */

import { server } from '../../server/index.js';
import { io as Client } from 'socket.io-client';

let client1;
let client2;

// Antes de correr cualquier test arrancamos el servidor en el puerto 3001.
beforeAll((done) => {
    server.listen(3001, done);
});

// Despues de que los test terminen cerramos el servidor.('?' ejecuta solo si existe)
afterAll((done) => {
    client1?.disconnect();
    client2?.disconnect();
    server.close(done);
});


test('Un usuario envia un mensaje y el otro usuario recibe', (done) => {

    // Creamos dos clientes(navegadores)
    client1 = new Client('http://localhost:3001');
    client2 = new Client('http://localhost:3001');

    client2.on('chat message', (msg) => {
        expect(msg).toEqual({
            text: 'Hola Mundo',
            username: expect.any(String)
        });
        done();
    });

    client1.on('connect', () => {
        client1.emit('chat message',  'Hola Mundo');
    })

});
