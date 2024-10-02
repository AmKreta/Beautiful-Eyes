import {Lexer, TOKEN_TYPE} from './src';
import { Parser } from './src/parser/parser';
import {Stringify} from './src/visitors/stringify/stringify';
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
    // const codeGen = new CodeGenerator();
    // const res = codeGen.eval(ast);
    const stringify = new Stringify();
    const stringifiedRes = stringify.eval(ast);
    console.log(stringifiedRes);
    return "module.exports = "+stringifiedRes;
}

transform(`@if(a%2===0){
 @if(a%4===0){
  <h1>a {a + ' '} is even and divisible by 4 </h1>
 }
}`)