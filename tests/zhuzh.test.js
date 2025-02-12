
const жуж = require('../src/zhuzh.js');

describe('жуж', () => {
    let interpreter;

    beforeEach(() => {
        interpreter = new жуж();
    });

    test('converts runes to latin', () => {
        expect(interpreter.fromRunes('ᚹᚨᛞᚨ')).toBe('wada');
    });

    test('stores and returns variable assignment', () => {
        const result = interpreter.interpret('ᚹᚨᛞᚨ ᛟᛗᛁ = XLII');
        expect(result).toBe(42);
        expect(interpreter.variables['ᛟᛗᛁ']).toBe(42);
    });

    test('handles roman numerals', () => {
        expect(interpreter.fromRomanNumeral('XLII')).toBe(42);
    });

    test('basic interpretation', () => {
        const result = interpreter.interpret('ᚹᚨᛞᚨ ᛟᛗᛁ = XLII');
        expect(result).toBeDefined();
    });
});