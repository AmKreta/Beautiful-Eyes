import {Lexer, TOKEN_TYPE} from './src';
import { Parser } from './src/parser/parser';
import stringify from './src/stringify/stringify';
import { CodeGenerator } from './src/visitors/codeGenerator/codeGenerator';

export function printTokens(source:string){
    const lexer = new Lexer(source);
    let currentToken = lexer.getNextToken();
    while(currentToken.tokenType!==TOKEN_TYPE.END_OF_FILE){
        console.log(currentToken);
        currentToken = lexer.getNextToken();
    }
}

export default function transform(source:string){
    const lexer = new Lexer(source);
    const parser = new Parser(lexer);
    const ast = parser.parse();
    const codeGen = new CodeGenerator();
    const res = codeGen.eval(ast);
    const stringifiedRes = stringify(res);
    return "module.exports = "+stringifiedRes;
}

// const val = transform(`<div id={b.key} Click={amk}>
//    hello {b.key}
//    <button>clicked {count} times</button>
// </div>
// `)

// console.log(val);