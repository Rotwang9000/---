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

    test('executes while loops correctly', () => {
        const code = `
ᚹᚨᛞᚨ counter = III; ᛔ
ᚹᚻᛁᛚᛖ counter > I { 
    ᚹᚨᛞᚨ counter = counter - I; ᛔ
} ᛔ
`;
        interpreter.interpret(code);
        expect(interpreter.variables['counter']).toBe(I); // I represents roman numeral 1
    });
});