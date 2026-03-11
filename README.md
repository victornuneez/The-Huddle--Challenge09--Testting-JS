# ChatJS - The Huddle Challenge 09 🚀

Sistema de chat en tiempo real centrado en la fiabilidad y el testing. Este proyecto demuestra el uso de WebSockets y la implementación de pruebas automatizadas (TDD).

## ✨ Características
- 💬 Mensajería en tiempo real con **Socket.io**.
- 🛠️ Arquitectura modular (Validación, Emisión y Servidor separados).
- 🧪 Cobertura de pruebas completa (Unitarias e Integración).
- 📜 Historial de mensajes al conectarse.

## 🧪 Estrategia de Testing (Jest)

El proyecto incluye una suite de pruebas robusta dividida en:

### Integración (Real-time flow)
- **Fault Tolerance:** Garantiza que la desconexión de un cliente no interrumpa el servicio para el resto.
- **Message Propagation:** Verificación de que el servidor realice el broadcast correctamente a múltiples clientes simultáneos.
- **Payload Integrity:** Validación de que los objetos de mensaje mantengan su estructura (text, username) al viajar por el socket.

### Unitarias (Logic & Safety)
- **Message Validation (TDD):** Lógica estricta para el filtrado de contenido (longitud max. 20 caracteres, trim de espacios y prevención de nulos).
- **Socket Error Handling:** Simulación de fallos en el mapa de usuarios para asegurar que el proceso de broadcast sea resiliente a sockets inválidos.

## 🚀 Instalación
1. Clona el repositorio.
2. Instala dependencias: `npm install`
3. Corre los tests: `npm test`
4. Inicia el servidor: `npm run dev`
