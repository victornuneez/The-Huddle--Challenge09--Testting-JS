/**
 * Con estas pruebas unitarias verificamos que la funcion valida correctamente los mensajes del chat.
 * Para implementar la validacion de mensajes aplicamos el TDD.
 */

const { validateMessage } = require('../../server/messageValidator.js');

test('mensaje valido pasa la validacion', () => {
    expect(validateMessage('Hola')).toBe(true);
});

test('Mensaje vacio falla la validacion', () => {
    expect(validateMessage('')).toBe(false);
})

test('mensale solo espacios falla la validacion', () => {
    expect(validateMessage('   ')).toBe(false)
})

test('mensaje de 20 caracteres exactos pasa la validacion', () => {
    expect(validateMessage('12345678901234567890')).toBe(true);
})

test('mensaje de 21 caracteres falla la validaxion', () => {
    expect(validateMessage('123456789012345678901')).toBe(false);
})