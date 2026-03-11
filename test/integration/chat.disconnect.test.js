/**
 * Esta prueba de integracion garantiza que desconectar un cliente no rompe la comunicacion de los demas clientes con el servidor
 */

const { server } = require('../../server/index.js');
const { io: Client} = require('socket.io-client');

// Arreglo donde vamos a guardar los clientes.
let clients = [];
let connectCount = 0; // contador de clientes conectados para asegurarnos que esten conectados antes de enviarles mensajes.

// Se inicia el servidor
beforeAll((done) => {
    server.listen(3003);
    done();
});

// Se desconecta cada cliente y se cierra el servidor al final del test.
afterAll((done) => {
    clients.forEach(client => {
        client.disconnect()
    });

    server.close();
    done();
});

test('Servidor maneja desconexion de un cliente sin que afecte a los demas clientes', (done) => {
    
    // Creamos 3 clientes conectados al servidor
    clients = [
        new Client('http://localhost:3003'),
        new Client('http://localhost:3003'),
        new Client('http://localhost:3003')
    ];

    const messagesReceived = [[], [], []];
    console.log(messagesReceived)

    // Ponemos en escucha a cada cliente y guardamos los mensajes recibidos.
    clients.forEach((client, index) => {
        client.on('chat message', (msg) => {
            messagesReceived[index].push(msg.text);
        });
    });

    // Cada cliente incrementa el valor cuando se conecta.
    clients.forEach((client) => {
        client.on('connect', () => {
            connectCount++;

            if (connectCount === clients.length) {
                // Desconectamos al primer cliente
                clients[0].disconnect();

                clients[1].emit('chat message', 'Hola desde 2');
                clients[2].emit('chat message', 'Hola desde 3');

                // Esperamos con un delay para que los mensajes lleguen.
                setTimeout(() => {
                    
                    // Verificamos que los clientes 2 y 3 recibieron los mensajes.
                    expect(messagesReceived[1]).toContain('Hola desde 2');
                    expect(messagesReceived[1]).toContain('Hola desde 3');

                    expect(messagesReceived[2]).toContain('Hola desde 2');
                    expect(messagesReceived[2]).toContain('Hola desde 3');
                    
                    // El cliente desconectado no deberia recibir mensajes.
                    expect(messagesReceived[0].length).toBe(0);

                    done();
                }, 500); // medio segundo de delay.

            }
        });
    });
});

