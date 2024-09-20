import {Lexer, TOKEN_TYPE} from './src';
import { Parser } from './src/parser/parser';
import { CodeGenerator } from './src/visitors/codeGenerator/codeGenerator';

const str = `
    <div id="id" name={"Amresh"}> hello {name} </div>
    <span>
        <button>hello</button>
    </span>
`
const lexer = new Lexer(str);

// let currentToken = lexer.getNextToken();
// while(currentToken.tokenType!==TOKEN_TYPE.END_OF_FILE){
//     console.log(currentToken);
//     currentToken = lexer.getNextToken();
// }

const parser = new Parser(lexer);
const ast = parser.parse();

const codeGen = new CodeGenerator();
const res = codeGen.eval(ast);

console.log(res[1].children);