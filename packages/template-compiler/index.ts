import {Lexer} from './src';
import { Parser } from './src/parser/parser';
import stringify from './src/stringify/stringify';
import { CodeGenerator } from './src/visitors/codeGenerator/codeGenerator';

export default function(source:string){
    const lexer = new Lexer(source);
    const parser = new Parser(lexer);
    const ast = parser.parse();
    const codeGen = new CodeGenerator();
    const res = codeGen.eval(ast);
    const stringifiedRes = stringify(res);
    return "module.exports = "+stringifiedRes;
}