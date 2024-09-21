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
    console.log(res);
    const stringifiedRes = stringify(res);
    return "module.exports = "+stringifiedRes;
}

// const val = transform(`<div class="form-container">
//    <h2>Create Your Account</h2>
//    <form id="userForm">
//      <div class="input-group">
//        <label for="username">Username</label>
//        <input type="text" id="username" placeholder="Enter your username" />
//      </div>
//      <div class="input-group">
//        <label for="email">Email</label>
//        <input type="email" id="email" placeholder="Enter your email" />
//      </div>
//      <div class="input-group">
//        <label for="password">Password</label>
//        <input type="password" id="password" placeholder="Enter your password" />
//      </div>
//      <div class="input-group">
//        <label for="confirmPassword">Confirm Password</label>
//        <input type="password" id="confirmPassword" placeholder="Confirm your password" />
//      </div>
//      <button type="submit">Create Account</button>
//    </form>
//  </div>`)
