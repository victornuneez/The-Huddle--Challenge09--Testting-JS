/**
 * Comprobamos que el servidor haga correctamente el broadcast de mensajes
 */

const { server } = require('../../server/index.js')
const { io: Client } = require('socket.io-client') 

let clients = [];
let connectedCount = 0;

// Ejecutamos el servidor antes de realizar la consulta.
beforeAll((done) => {
    server.listen(3002);
    done();
});

// Desconectamos a los clientes y luego cerramos el servidor.
afterAll((done) => {
    clients.forEach(client => {
        client.disconnect()
    });

    server.close();
    done();
});

test('Todos los clientes reciben mensajes de los demas clientes', (done) => {

    // Creamos 3 clientes conectados al servidor.
    clients = [
        new Client('http://localhost:3002'),
        new Client('http://localhost:3002'),
        new Client('http://localhost:3002')
    ];

    // Guardamos cada mensaje que reciben los clientes en un arreglo de arreglos.
    const messagesReceived = [[], [], []];

    // A cada cliente lo ponemos a escuchar mensajes y guardamos los mensajes recibidos.
    clients.forEach((client, index) => {
        client.on('chat message', (msg) => {
            messagesReceived[index].push(msg.text);

            // Verificamos que cada cliente haya recibido 3 mensajes, antes de hacer las comprobaciones.
            if (messagesReceived.every(arr => arr.length === 3)) {
                expect(messagesReceived[0]).toEqual(['Hola 1', 'Hola 2', 'Hola 3']);
                expect(messagesReceived[1]).toEqual(['Hola 1', 'Hola 2', 'Hola 3']);
                expect(messagesReceived[2]).toEqual(['Hola 1', 'Hola 2', 'Hola 3']);
                done(); // avisamos a Jest que termino el test
            }
        });
    });

    // Conectamos a cada cliente y agregamos cada conexion en el contador 
    clients.forEach((client) => {
        client.on('connect', () => {
            connectedCount++;

            // Verificamos que todos los clientes se hayan conectado
            if (connectedCount === clients.length) {
                // Damos un pequenho delay para asegurarnos que los listeners esten listos
                setTimeout(() => {
                // Ahora enviamos los mensajes
                clients[0].emit('chat message', 'Hola 1');
                clients[1].emit('chat message', 'Hola 2');
                clients[2].emit('chat message', 'Hola 3');
                }, 500);
            }
        });
    });

});