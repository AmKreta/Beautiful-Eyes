import { TOKEN_TYPE } from "./token.enum";

export class Token{
    constructor(public tokenType:TOKEN_TYPE, public value:string, public isInterpolation?:boolean){}
}