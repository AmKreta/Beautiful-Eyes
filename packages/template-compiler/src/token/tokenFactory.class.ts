import { Token } from "./token.class";
import { TOKEN_TYPE, TOKEN_VALUE } from "./token.enum";

export class TokenFactory{
    static createFromType(token:TOKEN_TYPE){
        return new Token(token, TOKEN_VALUE[token]);
    }

    static createFromTypeAndValue(token:TOKEN_TYPE, value:string){
        return new Token(token, value);
    }
}