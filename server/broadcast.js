function broadcastMessage(usersMap, msg, senderId = null) {
    for (let [id, socket] of usersMap.entries()) {
        if (socket) {
            socket.emit('chat message', msg)
        }
    }
}

//module.exports = { broadcastMessage }

export { broadcastMessage }