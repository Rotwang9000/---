class Zhuzh {  // Changed from жуж to Zhuzh for better compatibility
    constructor() {
        this.runeMap = {
            'ᚨ': 'a', 'ᛒ': 'b', 'ᚲ': 'c', 'ᛞ': 'd', 'ᛖ': 'e',
            'ᚠ': 'f', 'ᚷ': 'g', 'ᚻ': 'h', 'ᛁ': 'i', 'ᛃ': 'j',
            'ᚲ': 'k', 'ᛚ': 'l', 'ᛗ': 'm', 'ᚾ': 'n', 'ᛟ': 'o',
            'ᛈ': 'p', 'ᚲ': 'q', 'ᚱ': 'r', 'ᛋ': 's', 'ᛏ': 't',
            'ᚢ': 'u', 'ᚹ': 'w', 'ᛪ': 'x', 'ᛃ': 'y', 'ᛉ': 'z'
        };
        this.keywords = {
            'ᚹᚨᛞᚨ': 'var',      // declare
            'ᛁᚠ': 'if',          // if
            'ᚹᚻᛁᛚᛖ': 'while',   // while loop
            'ᛏᚱᚢᛖ': 'true',     // true
            'ᚠᚨᛚᛋᛖ': 'false',    // false
            'ᚠᚢᚾᚲ': 'func',    // function declaration
            'ᚱᛖᛏ': 'return'     // return statement
        };
        this.operators = {
            'ᛈᛚᚢᛋ': '+',        // plus
            'ᛗᛁᚾᚢᛋ': '-',       // minus
            'ᛏᛁᛗᛖᛋ': '*',       // times
            'ᛞᛁᚹᛁᛞᛖ': '/',      // divide
            'ᛖᚲᚢᚨᛋ': '==',     // equals
            'ᚷᚱᛖᚨᛏᛖᚱ': '>',     // greater
            'ᛚᛖᛋᛋ': '<'         // less
        };
        this.variables = {};
        this.commentPrefix = 'ᚳᛟᛗ';  // 'kom' for komento (Esperanto for comment)

        // Add valid identifiers to help with suggestions
        this.validIdentifiers = {
            'ᛟᛗᛁ': 'omi',         // man
            'ᛋᚢᛗ': 'sum',         // sum
            'ᚱᛖᛋᚢᛚᛏ': 'result',   // result
            'ᚾᛟᛗᛁ': 'nomi',       // number/parameter
            'ᚾᛖᚹᛟᛗᛁ': 'newomi',   // new number (for recursion)
            'ᚠᚨᚲᛏᛟᚱ': 'faktor'    // factorial function name
        };

        this.errorMessages = {
            invalidToken: 'ᚾᚨᚠᚠ ᛏᛟᚲᛖᚾᛟ:', // "naff tokeno:"
            expectedToken: 'ᛖᛋᛈᛖᚱᛁᛋ:', // "esperis:" (expected)
            foundToken: 'ᛏᚱᛟᚹᛁᛋ:', // "trovis:" (found)
            expectedSemicolon: 'ᛗᚨᚾᚲᚨᛋ ᛔ', // "mankas punkto" (missing semicolon)
            undefinedVariable: 'ᚾᛖᚲᛟᚾᚨᛏᚨ ᚹᚨᚱᛁᚨᛒᛚᛟ:', // "nekonata variablo" (unknown variable)
            expectedAssignment: 'ᛗᚨᚾᚲᚨᛋ ᚨᛋᛁᚾᛟ', // "mankas asigno" (missing assignment)
            invalidIdentifier: 'ᚾᚨᚠᚠ ᚾᛟᛗᛟ:', // "naff nomo:" (bad name)
            suggestion: 'ᛈᚱᛟᚹᚢ:', // "provu:" (try)
            expectedIdentifier: 'ᛖᛋᛈᛖᚱᛁᛋ ᚾᛟᛗᛟᚾ:', // "esperis nomon:" (expected name)
            validNames: 'ᚹᚨᛚᛁᛞᚨᛃ ᚾᛟᛗᛟᛃ:', // "validaj nomoj:" (valid names)
            undefinedFunction: 'ᚾᛖᚲᛟᚾᚨᛏᚨ ᚠᚢᚾᚲᛋᛁᛟ:', // unknown function
            expectedParams: 'ᛖᛋᛈᛖᚱᛁᛋ ᛈᚨᚱᚨᛗᛋ:', // expected parameters
            expectedReturn: 'ᛖᛋᛈᛖᚱᛁᛋ ᚱᛖᛏᚢᚱᚾᛟ:' // expected return value
        };

        // Add symbol mappings
        this.symbols = {
            'ᛋ': '=',        // set (shorter version)
            'ᛔ': ';',        // punkto (single rune)
            'ᛗ': '(',        // malfermi (shorter)
            'ᚠ': ')',        // fermi (shorter)
            'ᛒ': '{',        // bloko (shorter)
            'ᚲ': '}'         // kloso (shorter)
        };

        // Fix patterns with correct boundaries and full runic Unicode range for identifiers
        this.patterns = [
            // Whitespace first
            { type: 'WHITESPACE', pattern: /^[\s\n]+/ },
            
            // Parse comments before tokens, with better boundary handling
            { type: 'COMMENT', pattern: new RegExp(`(?:^|\\s)(${this.commentPrefix}.*?)(?=\\n|$)`) },
            
            // Then tokens in order
            { type: 'KEYWORD', pattern: new RegExp(`^(${Object.keys(this.keywords).join('|')})(?=\\s|[ᛒᛔ])`) },
            { type: 'EQUALS', pattern: /^ᛋ(?![\u16A0-\u16FF])/ },
            { type: 'SEMICOLON', pattern: /^ᛔ/ },
            { type: 'LPAREN', pattern: /^ᛗ/ },
            { type: 'RPAREN', pattern: /^ᚠ/ },
            { type: 'LBRACE', pattern: /^ᛒ/ },
            { type: 'RBRACE', pattern: /^ᚲ/ },
            { type: 'NUMBER', pattern: /^[IVXLCDM]+(?=[ᚠᛒᚲᛔ\s]|$)/ },
            { type: 'OPERATOR', pattern: new RegExp(`^(${Object.keys(this.operators).join('|')})(?=\\s)`) },
            // Identifiers last to avoid consuming keywords
            { type: 'IDENTIFIER', pattern: /^[\u16A0-\u16FF]+(?=[\s\ᛗᚠᛋᛔ]|$)/ }
        ];

        // Add function storage
        this.functions = {};
        this.isFunctionContext = false; // Add new state variable
        this.parsingFunction = false; // Add state for function context
        this.functionParams = new Set(); // Add set for tracking function parameters
        this.currentScope = new Set(); // Track current function scope

        // Add new scope management
        this.scopes = [new Set()]; // Stack of scopes
        this.currentNesting = 0;

        // More robust scope handling
        this.scopeStack = [{
            vars: new Set(Object.keys(this.validIdentifiers)),
            type: 'global'
        }];
        this.currentScope = this.scopeStack[0];

        // Add keywords to valid identifiers by default
        Object.keys(this.keywords).forEach(keyword => {
            this.validIdentifiers[keyword] = keyword;
        });

        // Fix identifier pattern to correctly handle keywords
        this.patterns = [
            { type: 'WHITESPACE', pattern: /^[\s\n]+/ },
            { type: 'COMMENT', pattern: new RegExp(`(?:^|\\s)(${this.commentPrefix}.*?)(?=\\n|$)`) },
            // Match keywords before identifiers, with strict boundaries
            { type: 'KEYWORD', pattern: new RegExp(`^(${Object.keys(this.keywords).join('|')})(?=[\\s\\{\\}\\(\\);])`) },
            // ...rest of patterns...
        ];

        // Redefine patterns with more precise comment handling
        this.patterns = [
            // Match whitespace without comments first
            { type: 'WHITESPACE', pattern: /^[\s\n]+/ },
            
            // Match complete comment line or end of line comment
            { type: 'COMMENT', pattern: new RegExp(`^${this.commentPrefix}.*$|\\s+${this.commentPrefix}.*$`) },
            
            // Match keywords with strict boundaries
            { type: 'KEYWORD', pattern: new RegExp(`^(${Object.keys(this.keywords).join('|')})(?=[\\s\\{\\}\\(\\);])`) },
            
            // Match operators before other symbols
            { type: 'OPERATOR', pattern: new RegExp(`^(${Object.keys(this.operators).join('|')})(?=\\s)`) },
            
            // Match symbols
            { type: 'EQUALS', pattern: /^ᛋ(?![\u16A0-\u16FF])/ },
            { type: 'SEMICOLON', pattern: /^ᛔ/ },
            { type: 'LPAREN', pattern: /^ᛗ/ },
            { type: 'RPAREN', pattern: /^ᚠ/ },
            { type: 'LBRACE', pattern: /^ᛒ/ },
            { type: 'RBRACE', pattern: /^ᚲ/ },
            
            // Match numbers with strict boundaries
            { type: 'NUMBER', pattern: /^[IVXLCDM]+(?=[ᚠᛒᚲᛔ\s]|$)/ },
            
            // Match identifiers last, with strict boundaries
            { type: 'IDENTIFIER', pattern: /^[\u16A0-\u16FF]+(?=[\s\ᛗᚠᛋᛔ]|$)/ }
        ];

        // Add separate storage for function names
        this.declaredFunctions = new Set();
    }

    enterScope(type) {
        // Create new scope inheriting from parent
        const newScope = {
            vars: new Set(),
            type,
            parent: this.currentScope
        };
        this.scopeStack.push(newScope);
        this.currentScope = newScope;
    }

    exitScope() {
        if (this.scopeStack.length > 1) {
            this.scopeStack.pop();
            this.currentScope = this.scopeStack[this.scopeStack.length - 1];
        }
    }

    isIdentifierValid(identifier) {
        // Check all accessible scopes
        let scope = this.currentScope;
        while (scope) {
            if (scope.vars.has(identifier)) return true;
            scope = scope.parent;
        }
        return false;
    }

    declareIdentifier(identifier, type = 'var') {
        this.currentScope.vars.add(identifier);
        // Also add to validIdentifiers for error messages
        this.validIdentifiers[identifier] = identifier;
    }

    preprocess(code) {
        // First remove all comments to avoid interference
        const cleanCode = code
            .split('\n')
            .map(line => line.replace(new RegExp(`${this.commentPrefix}.*`), ''))
            .join('\n');
        
        // First pass: register function names
        const lines = cleanCode.split('\n');
        for (const line of lines) {
            const tokens = line.trim().split(/\s+/);
            const funcIndex = tokens.indexOf('ᚠᚢᚾᚲ');
            if (funcIndex !== -1 && funcIndex + 1 < tokens.length) {
                const functionName = tokens[funcIndex + 1];
                // Register function name globally
                this.declaredFunctions.add(functionName);
                this.validIdentifiers[functionName] = functionName;
            }
        }
    }

    getSuggestion(input, context = '') {
        // First check if the input is a valid identifier
        if (this.validIdentifiers[input]) return '';
        
        // Check context for what identifier might be expected
        const line = String(context).trim();
        
        // Get all eligible identifiers that could be used here
        const validNames = Object.keys(this.validIdentifiers);
        
        if (line.includes('ᛈᛚᚢᛋ')) {
            // If we're doing arithmetic, suggest valid operand names
            const parts = line.split(/\s+/);
            const usedNames = parts.filter(p => this.validIdentifiers[p]);
            return validNames
                .filter(name => !usedNames.includes(name))
                .join(' | ');
        }

        // Default to listing all valid identifiers
        return validNames.join(' | ');
    }

    getCurrentLineInfo(input, processedInput, currentLine) {
        const lines = input.split('\n');
        const fullLine = lines[currentLine - 1] || '';
        return {
            fullLine,
            processedLength: processedInput.split('\n').pop()?.length || 0
        };
    }

    tokenize(code) {
        // Pre-remove all comments
        code = code
            .split('\n')
            .map(line => line.replace(new RegExp(`${this.commentPrefix}.*`), ''))
            .join('\n');
        
        // Run preprocessor first
        this.preprocess(code);
        
        // Regular tokenization
        console.log('Starting tokenization');
        let input = code;
        let lineNum = 1;
        let colNum = 1;
        const tokens = [];
        let isDeclaration = false;
        let inFunctionParams = false;

        while (input.length > 0) {
            let matched = false;
            
            // Handle full-line comments (if any remain after inline removal)
            if (input.match(new RegExp(`^\\s*${this.commentPrefix}`))) {
                const eol = input.indexOf('\n');
                if (eol === -1) {
                    input = '';
                } else {
                    input = input.slice(eol + 1);
                    lineNum++;
                    colNum = 1;
                }
                matched = true;
                continue;
            }

            for (const {type, pattern} of this.patterns) {
                const match = input.match(pattern);
                if (!match) continue;

                const value = match[0];
                console.log(`Matched ${type}:`, value);

                switch (type) {
                    case 'COMMENT':
                        // Skip comment tokens entirely to avoid interference with code
                        if (value.includes('\n')) {
                            lineNum++;
                            colNum = 1;
                        } else {
                            colNum += value.length;
                        }
                        input = input.slice(value.length);
                        matched = true;
                        continue;

                    case 'WHITESPACE':
                        // Just update position
                        if (value.includes('\n')) {
                            lineNum++;
                            colNum = 1;
                        } else {
                            colNum += value.length;
                        }
                        break;

                    case 'KEYWORD':
                        if (value === 'ᚠᚢᚾᚲ') {
                            inFunctionParams = true;
                            this.enterScope('function');
                        }
                        tokens.push({ type, value, line: lineNum, col: colNum });
                        break;

                    case 'IDENTIFIER':
                        // Allow if it's already known or in function params context
                        if (this.declaredFunctions.has(value) || 
                            inFunctionParams || 
                            this.validIdentifiers[value] || 
                            isDeclaration) {
                            
                            if (isDeclaration) {
                                this.validIdentifiers[value] = value;
                                isDeclaration = false;
                            }
                            tokens.push({ type, value, line: lineNum, col: colNum });
                        } else {
                            throw new Error(`${this.errorMessages.invalidIdentifier}\n${input.split('\n')[0]}\n${' '.repeat(colNum - 1)}^\n${this.errorMessages.validNames} ${Object.keys(this.validIdentifiers).join(' | ')}`);
                        }
                        break;

                    case 'LPAREN':
                        tokens.push({ type, value, line: lineNum, col: colNum });
                        inFunctionParams = true;
                        break;

                    case 'RPAREN':
                        tokens.push({ type, value, line: lineNum, col: colNum });
                        inFunctionParams = false;
                        break;

                    case 'LBRACE':
                        // Don't reset function context immediately
                        tokens.push({ type, value, line: lineNum, col: colNum });
                        colNum += value.length;
                        break;

                    case 'RBRACE':
                        this.exitScope();
                        tokens.push({ type, value, line: lineNum, col: colNum });
                        colNum += value.length;
                        break;

                    default:
                        tokens.push({ type, value, line: lineNum, col: colNum });
                        colNum += value.length;
                }

                input = input.slice(value.length);
                matched = true;
                break;
            }

            if (!matched) {
                console.log('No match at:', input.slice(0, 10));
                const currentLine = input.split('\n')[0];
                const pointer = ' '.repeat(colNum - 1) + '^';
                throw new Error(`${this.errorMessages.invalidToken}\n${currentLine}\n${pointer}`);
            }
        }

        console.log('Tokens:', tokens);
        return tokens;
    }

    parse(tokens) {
        const ast = {
            type: 'Program',
            body: []
        };

        const parseExpression = () => {
            if (tokens.length < 2) return parsePrimary();
            
            // Look ahead for assignment operator (ᛋ)
            if (tokens[1] && tokens[1].type === 'EQUALS') {
                const identifier = tokens.shift();
                tokens.shift(); // consume equals
                return {
                    type: 'AssignmentExpression',
                    identifier: identifier.value,
                    value: parseExpression()
                };
            }

            let left = parsePrimary();
            
            while (tokens.length > 0 && tokens[0].type === 'OPERATOR') {
                const operator = tokens.shift().value;
                const right = parsePrimary();
                left = {
                    type: 'BinaryExpression',
                    operator: this.operators[operator],
                    left,
                    right
                };
            }
            return left;
        };

        const parsePrimary = () => {
            if (!tokens.length) throw new Error('Unexpected end of input');
            const token = tokens[0];
            
            switch (token.type) {
                case 'NUMBER':
                    tokens.shift();
                    return { type: 'NumericLiteral', value: token.value };
                case 'IDENTIFIER':
                    tokens.shift();
                    if (tokens[0] && tokens[0].type === 'LPAREN') {
                        return parseFunctionCall(token.value);
                    }
                    return { type: 'Identifier', name: token.value };
                case 'LPAREN':
                    tokens.shift();
                    const expr = parseExpression();
                    if (!tokens.length || tokens[0].type !== 'RPAREN') {
                        throw new Error('Expected closing parenthesis');
                    }
                    tokens.shift();
                    return expr;
                default:
                    throw new Error(`Unexpected token: ${token.value}`);
            }
        };

        const parseFunctionDecl = () => {
            tokens.shift(); // consume func keyword
            const name = tokens.shift();
            if (name.type !== 'IDENTIFIER') {
                throw new Error(this.errorMessages.expectedIdentifier);
            }

            if (tokens[0].type !== 'LPAREN') {
                throw new Error(this.errorMessages.expectedParams);
            }
            tokens.shift(); // consume (

            const params = [];
            while (tokens[0].type !== 'RPAREN') {
                if (tokens[0].type !== 'IDENTIFIER') {
                    throw new Error(this.errorMessages.expectedIdentifier);
                }
                params.push(tokens.shift().value);
                if (tokens[0].type === 'COMMA') tokens.shift();
            }
            tokens.shift(); // consume )

            if (tokens[0].type !== 'LBRACE') {
                throw new Error('Expected opening brace');
            }
            tokens.shift(); // consume {

            const body = [];
            while (tokens.length && tokens[0].type !== 'RBRACE') {
                body.push(parseStatement());
            }
            
            if (!tokens.length || tokens[0].type !== 'RBRACE') {
                throw new Error('Expected closing brace');
            }
            tokens.shift(); // consume }

            params.forEach(param => {
                this.functionParams.add(param);
                this.validIdentifiers[param] = param;
            });

            return {
                type: 'FunctionDeclaration',
                name: name.value,
                params,
                body
            };
        };

        const parseFunctionCall = (identifier) => {
            tokens.shift(); // consume (
            const args = [];
            while (tokens[0].type !== 'RPAREN') {
                args.push(parseExpression());
                if (tokens[0].type === 'COMMA') tokens.shift();
            }
            tokens.shift(); // consume )
            return {
                type: 'FunctionCall',
                name: identifier,
                arguments: args
            };
        };

        const parseStatement = () => {
            const token = tokens[0];
            
            if (token.type === 'KEYWORD') {
                switch (token.value) {
                    case 'ᚹᚨᛞᚨ':  // variable declaration
                        tokens.shift(); // consume wada
                        const expr = parseExpression();
                        if (expr.type !== 'AssignmentExpression') {
                            throw new Error(this.errorMessages.expectedAssignment);
                        }
                        // Ensure semicolon
                        if (!tokens.length || tokens[0].type !== 'SEMICOLON') {
                            throw new Error(this.errorMessages.expectedSemicolon);
                        }
                        tokens.shift(); // consume semicolon
                        return {
                            type: 'VariableDeclaration',
                            identifier: expr.identifier,
                            value: expr.value
                        };
                    case 'ᛁᚠ':  // if statement
                        tokens.shift(); // consume if
                        const condition = parseExpression();
                        if (!tokens.length || tokens[0].type !== 'LBRACE') {
                            throw new Error('Expected opening brace');
                        }
                        tokens.shift(); // consume {
                        const body = [];
                        while (tokens.length && tokens[0].type !== 'RBRACE') {
                            body.push(parseStatement());
                        }
                        if (!tokens.length || tokens[0].type !== 'RBRACE') {
                            throw new Error('Expected closing brace');
                        }
                        tokens.shift(); // consume }
                        // Optional semicolon after block
                        if (tokens.length && tokens[0].type === 'SEMICOLON') {
                            tokens.shift();
                        }
                        return {
                            type: 'IfStatement',
                            condition,
                            body
                        };
                    case 'ᚹᚻᛁᛚᛖ': {  // while loop
                        tokens.shift(); // consume while
                        const condition = parseExpression();
                        if (!tokens.length || tokens[0].type !== 'LBRACE') {
                            throw new Error('Expected opening brace for while loop');
                        }
                        tokens.shift(); // consume {
                        const body = [];
                        while (tokens.length && tokens[0].type !== 'RBRACE') {
                            body.push(parseStatement());
                        }
                        if (!tokens.length || tokens[0].type !== 'RBRACE') {
                            throw new Error('Expected closing brace for while loop');
                        }
                        tokens.shift(); // consume }
                        if (tokens.length && tokens[0].type === 'SEMICOLON') {
                            tokens.shift(); // optional semicolon
                        }
                        return { type: 'WhileStatement', condition, body };
                    }
                    case 'ᚠᚢᚾᚲ':
                        return parseFunctionDecl();
                    case 'ᚱᛖᛏ': {
                        tokens.shift(); // consume return
                        const value = parseExpression();
                        if (tokens[0].type !== 'SEMICOLON') {
                            throw new Error(this.errorMessages.expectedSemicolon);
                        }
                        tokens.shift(); // consume ;
                        return { type: 'ReturnStatement', value };
                    }
                }
            }
            
            const expr = parseExpression();
            if (!tokens.length || tokens[0].type !== 'SEMICOLON') {
                throw new Error(this.errorMessages.expectedSemicolon);
            }
            tokens.shift(); // consume semicolon
            return expr;
        };

        while (tokens.length > 0) {
            ast.body.push(parseStatement());
        }
        
        return ast;
    }

    evaluate(ast) {
        const evaluateNode = (node, scope = this.variables) => {
            switch (node.type) {
                case 'NumericLiteral':
                    return this.fromRomanNumeral(node.value);
                case 'Identifier':
                    if (!(node.name in scope)) {
                        throw new Error(this.errorMessages.undefinedVariable + ` ${node.name}`);
                    }
                    return scope[node.name];
                case 'AssignmentExpression': {
                    const assignValue = evaluateNode(node.value, scope);
                    scope[node.identifier] = assignValue;
                    return assignValue;
                }
                case 'BinaryExpression': {
                    const left = evaluateNode(node.left, scope);
                    const right = evaluateNode(node.right, scope);
                    switch (node.operator) {
                        case '+': return left + right;
                        case '-': return left - right;
                        case '*': return left * right;
                        case '/': return left / right;
                        case '==': return left === right;
                        case '>': return left > right;
                        case '<': return left < right;
                        default: throw new Error(`Unknown operator: ${node.operator}`);
                    }
                }
                case 'VariableDeclaration': {
                    const declaredValue = evaluateNode(node.value, scope);
                    scope[node.identifier] = declaredValue;
                    return declaredValue;
                }
                case 'IfStatement': {
                    if (evaluateNode(node.condition, scope)) {
                        // Updated to reference the body property instead of an undefined consequent
                        return this.evaluate({ body: node.body }, scope);
                    }
                    return undefined;
                }
                case 'WhileStatement': {
                    let lastResult;
                    while (evaluateNode(node.condition, scope)) {
                        // Execute all statements in the body
                        for (const stmt of node.body) {
                            lastResult = evaluateNode(stmt, scope);
                        }
                    }
                    // Return the final value of the variable we're interested in
                    return scope['ᚱᛖᛋᚢᛚᛏ'] || lastResult;
                }
                case 'FunctionDeclaration': {
                    this.functions[node.name] = {
                        params: node.params,
                        body: node.body
                    };
                    return undefined;
                }
                case 'FunctionCall': {
                    const func = this.functions[node.name];
                    if (!func) {
                        throw new Error(this.errorMessages.undefinedFunction + ` ${node.name}`);
                    }
                    
                    // Create new scope for function
                    const functionScope = { ...scope };
                    
                    // Evaluate and bind arguments
                    node.arguments.forEach((arg, i) => {
                        functionScope[func.params[i]] = evaluateNode(arg, scope);
                    });
                    
                    // Execute function body
                    let result;
                    for (const stmt of func.body) {
                        if (stmt.type === 'ReturnStatement') {
                            result = evaluateNode(stmt.value, functionScope);
                            break;
                        }
                        result = evaluateNode(stmt, functionScope);
                    }
                    return result;
                }
                default:
                    throw new Error(`Unknown node type: ${node.type}`);
            }
        };

        let lastValue;
        for (const node of ast.body) {
            lastValue = evaluateNode(node);
        }
        return lastValue;
    }

    interpret(code) {
        try {
            const tokens = this.tokenize(code);
            const ast = this.parse(tokens);
            return this.evaluate(ast);
        } catch (e) {
            // Translate common error messages
            for (const [key, msg] of Object.entries(this.errorMessages)) {
                if (e.message.startsWith(msg)) {
                    return `${msg} ${e.message.slice(msg.length)}`;
                }
            }
            return `ᚾᚨᚠᚠ ᚠᚢᚾᚲᛋᛁᛟ: ${e.message}`; // "naff funkcio"
        }
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

    // Updated helper to convert between runic alphabets using variant mappings
    toUpperCaseRunes(str) {
        // Example mapping; extend using reference: https://en.wikipedia.org/wiki/Runic_(Unicode_block)
        const variantMapping = {
            'ᚠ': 'ᚠ', 'ᚡ': 'ᚠ', // example: map variant ᚡ to standard ᚠ
            'ᚢ': 'ᚢ',
            'ᚦ': 'ᚦ',
            'ᚨ': 'ᚨ',
            'ᚱ': 'ᚱ',
            'ᚲ': 'ᚲ',
            'ᚷ': 'ᚷ',
            'ᚹ': 'ᚹ',
            'ᚺ': 'ᚻ', // if variant exists
            'ᛁ': 'ᛁ'
            // ...add additional mappings as needed based on the wiki list...
        };
        return [...str].map(ch => variantMapping[ch] || ch).join('');
    }
}

// Export both names for compatibility
if (typeof window !== 'undefined') {
    window.Zhuzh = Zhuzh;
    window.жуж = Zhuzh;  // Alias for the cyrillic name
}

if (typeof module !== 'undefined') {
    module.exports = Zhuzh;
}
