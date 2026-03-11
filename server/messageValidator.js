function validateMessage(msg) {

    const text = typeof msg === 'string' ? msg : msg?.text;
    // Validamos si hay un mensaje
    if(!text) {
        return false
    }

    // Validamos que haya caracteres en el mensaje
    if (text.trim().length === 0) {
        return false
    }

    // Validamos que el mensaje no sea muy largo
    if (text.length > 20 ) {
        return false
    }

    return true
};

//module.exports = { validateMessage };

export { validateMessage }