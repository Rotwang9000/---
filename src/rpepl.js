class RPEPL {
    constructor() {
        this.runeMap = {
            'ᚨ': 'a', 'ᛒ': 'b', 'ᚲ': 'c', 'ᛞ': 'd', 'ᛖ': 'e',
            'ᚠ': 'f', 'ᚷ': 'g', 'ᚻ': 'h', 'ᛁ': 'i', 'ᛃ': 'j',
            'ᚲ': 'k', 'ᛚ': 'l', 'ᛗ': 'm', 'ᚾ': 'n', 'ᛟ': 'o',
            'ᛈ': 'p', 'ᚲ': 'q', 'ᚱ': 'r', 'ᛋ': 's', 'ᛏ': 't',
            'ᚢ': 'u', 'ᚹ': 'w', 'ᛪ': 'x', 'ᛃ': 'y', 'ᛉ': 'z'
        };
        this.keywords = {
            'ᚹᚨᛞᚨ': 'var'    // Only translate declaration keyword
        };
        this.variables = {};
    }

    fromRomanNumeral(roman) {
        const values = { 'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000 };
        let result = 0;
        
        for (let i = 0; i < roman.length; i++) {
            const current = values[roman[i]];
            const next = values[roman[i + 1]];
            
            if (next > current) {
                result += next - current;
                i++;
            } else {
                result += current;
            }
        }
        return result;
    }

    interpret(code) {
        try {
            // Handle Roman numerals first
            const numericCode = code.replace(/[IVXLCDM]+/g, (match) => 
                this.fromRomanNumeral(match)
            );

            // Only translate declaration keywords, keep variable names as runes
            const processedCode = numericCode.replace(/ᚹᚨᛞᚨ/g, 'var');
            
            // Create a function that will execute in our runic variable scope
            const runInContext = new Function('context', `
                with(context) {
                    ${processedCode}
                    return context.variables;
                }
            `);
            
            // Execute and update variables
            const newVars = runInContext.call(this, { variables: this.variables });
            this.variables = newVars;

            // Return the last assigned value if it exists
            const match = code.match(/=\s*([IVXLCDM]+)/);
            return match ? this.fromRomanNumeral(match[1]) : 'vada!';
        } catch (e) {
            return `Naff funkcio: ${e.message}`;
        }
    }
}

if (typeof window !== 'undefined') {
    window.RPEPL = RPEPL;
}

if (typeof module !== 'undefined') {
    module.exports = RPEPL;
}
