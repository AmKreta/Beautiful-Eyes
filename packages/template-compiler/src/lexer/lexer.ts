import { TOKEN_TYPE, TOKEN_VALUE, TokenFactory, Token } from "../token";
import { isText } from "./util";

export class Lexer{
    private currentPosition = 0;
    private prevToken:Token = TokenFactory.createFromType(TOKEN_TYPE.START_OF_FILE);
    
    constructor(private source:string){}

    public peek(position=1){
        return this.source.substring(this.currentPosition, this.currentPosition+position);
    }

    private advance(jump=1){
        this.currentPosition+=jump;
    }

    private skipWhitespace(){
        while(this.currentPosition<this.source.length && (this.currentChar===' ' || this.currentChar==='')){
            this.advance();
        }
    }

    private skipNextLine(){
        while(this.currentPosition<this.source.length && (this.currentChar==='\n' || this.currentChar==='\t')){
            this.advance();
        }
    }

    private skipSkipable(){
        this.skipNextLine();
        this.skipWhitespace();
    }

    private get currentChar(){
        return this.source[this.currentPosition];
    }

    public getNextToken(){
        this.skipSkipable();
        if(this.currentChar==='\n'){
            this.skipSkipable();
        }
        if(this.currentPosition >= this.source.length){
            return TokenFactory.createFromType(TOKEN_TYPE.END_OF_FILE);
        }
        switch(this.currentChar){
            case '<':
                this.advance();
                return this.prevToken = TokenFactory.createFromType(TOKEN_TYPE.TAG_OPEN);
            case '>':
                this.advance();
                return this.prevToken = TokenFactory.createFromType(TOKEN_TYPE.TAG_CLOSE);
            case '/':
                this.advance();
                return this.prevToken = TokenFactory.createFromType(TOKEN_TYPE.TAG_CLOSE_SLASH);
            case '=':
                this.advance();
                return this.prevToken = TokenFactory.createFromType(TOKEN_TYPE.ASSIGNMENT);
            case '@':
                this.advance();
                return this.prevToken = TokenFactory.createFromType(TOKEN_TYPE.AT_THE_RATE);
            case '#':
                this.advance();
                return this.prevToken = TokenFactory.createFromType(TOKEN_TYPE.HASH);
            case '$':
                this.advance();
                return this.prevToken = TokenFactory.createFromType(TOKEN_TYPE.DOLLAR);
            case '{':
                return TokenFactory.createFromTypeAndValue(TOKEN_TYPE.INTERPOLATION, this.readJSXInterpolation());
            case "'":
                this.advance();
                return TokenFactory.createFromType(TOKEN_TYPE.SINGLE_QUOTE);
            case '"':
                this.advance();
                return TokenFactory.createFromType(TOKEN_TYPE.DOUBLE_QUOTE);
            default:
                if(isText(this.currentChar)){
                    return TokenFactory.createFromTypeAndValue(TOKEN_TYPE.STRING, this.readText());
                }
            const currToken = this.currentChar
            throw new Error(`unidentified token ${currToken}`);
        }
    }

    private readText(){
        const delimeters = ['"', "'", '{', "<", ">", "="];
        if(this.prevToken.tokenType===TOKEN_TYPE.TAG_OPEN){
            delimeters.push(' '); // <div id='a' , it will read only till div
        }
        let res='';
        while(this.currentPosition< this.source.length && !delimeters.includes(this.currentChar)){
            res+=this.source[this.currentPosition++];
        }
       return res;
    }

    private readJSXInterpolation(){
        // parse context within {}
        if(this.currentChar!=='{'){
            throw new Error(`expected '{' got '${this.currentChar}'`);
        }
        let res = '';
        this.currentPosition++;
        while(this.currentPosition<this.source.length && (this.currentChar as any)!=='}'){
            if((this.currentChar as any)==='`'){
               res+= this.readStringInterpolation();
            }
            else{
                res+=this.source[this.currentPosition++];
            }
        }
        if((this.currentChar as any)!=='}'){
            throw new Error(`expected '}' got '${TOKEN_VALUE[TOKEN_TYPE.END_OF_FILE]}'`);
        }
        this.advance(); // skipping closing '}'
        return res;
    }

    private readStringInterpolation(){
        //parse content withing ``
        if(this.currentChar!=='`'){
            throw new Error(`expected '\`' got '${this.currentChar}'`);
        }
        let res = '`';
        this.currentPosition++;
        while(this.currentPosition<this.source.length && this.currentChar!=='`'){
            if(this.currentChar==='$'){
               this.currentPosition++;
               res+= `\${${this.readJSXInterpolation()}}`;
            }
            else{
                res+=this.source[this.currentPosition++];
            }
        }
        if(this.currentChar!=='`'){
            throw new Error(`expected '\`' got '${TOKEN_VALUE[TOKEN_TYPE.END_OF_FILE]}'`);
        }
        this.currentPosition++; // skipping closing `
        return res;
    }

}