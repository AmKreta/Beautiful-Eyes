import { Lexer } from "../lexer/lexer";
import { astNode } from "../nodes/astNode/astNode";
import { HtmlAttribute } from "../nodes/HtmlAttribute/HtmlAttribute";
import { HtmlChild } from "../nodes/HtmlChild/htmlChild";
import { HtmlElement } from "../nodes/HtmlElement/HtmlElement";
import { Token, TOKEN_TYPE, TOKEN_VALUE } from "../token";

export class Parser{
    currentToken:Token;
    constructor(
        private lexer:Lexer
    ){
        this.currentToken = this.lexer.getNextToken();
    }

    eat(expectedToken:TOKEN_TYPE ){
        if(this.currentToken.tokenType === expectedToken){
            this.currentToken = this.lexer.getNextToken();
        }
        else{
            throw new Error(`expected ${TOKEN_VALUE[expectedToken]} got ${TOKEN_VALUE[this.currentToken.tokenType]}`);
        }
    }

    parseChildren(){
        switch(this.currentToken.tokenType){
            case TOKEN_TYPE.STRING:{
                const content = this.currentToken.value;
                this.eat(TOKEN_TYPE.STRING);
                return new HtmlChild(content);
            }
            case TOKEN_TYPE.INTERPOLATION:{
                const content = this.currentToken.value;
                this.eat(TOKEN_TYPE.INTERPOLATION);
                return new HtmlChild(content, true);
            }   
            case TOKEN_TYPE.TAG_OPEN:
                return this.parseTag();
            default:
                throw new Error(`while parsing children, expected string, interpolation or htmlElements got ${this.currentToken}`);
        }
    }

    parseAttribute(){
        const attributeName = this.currentToken.value;
        this.eat(TOKEN_TYPE.STRING);
        this.eat(TOKEN_TYPE.ASSIGNMENT);
        if([TOKEN_TYPE.SINGLE_QUOTE, TOKEN_TYPE.DOUBLE_QUOTE].includes(this.currentToken.tokenType)){
            this.eat(this.currentToken.tokenType); // it's either ' or ""
            const val = this.currentToken.value;
            this.eat(TOKEN_TYPE.STRING);
            this.eat(this.currentToken.tokenType);
            return new HtmlAttribute(attributeName, val);
        }
        else if(this.currentToken.tokenType===TOKEN_TYPE.INTERPOLATION){
            // interpolation
            const val = this.currentToken.value;
            this.eat(TOKEN_TYPE.INTERPOLATION);
            return new HtmlAttribute(attributeName, val, true);
        }
        throw new Error(`expected string or interpolation got ${this.currentToken}`)
    }

    parseTag(){
        this.eat(TOKEN_TYPE.TAG_OPEN);
        const tagNAme = this.currentToken.value;
        this.eat(TOKEN_TYPE.STRING);
        const attributes:HtmlAttribute[] = [];
        while(this.currentToken.tokenType!==TOKEN_TYPE.TAG_CLOSE){
            attributes.push(this.parseAttribute());
        }
        if(this.lexer.peek()===TOKEN_VALUE[TOKEN_TYPE.TAG_CLOSE_SLASH]){
            this.eat(TOKEN_TYPE.TAG_CLOSE_SLASH);
            this.eat(TOKEN_TYPE.TAG_CLOSE);
            return new HtmlElement(tagNAme, attributes);
        }
        else{
            this.eat(TOKEN_TYPE.TAG_CLOSE);
            const children:(HtmlChild | HtmlElement)[] = [];
            while(!((this.currentToken.tokenType as any)===TOKEN_TYPE.TAG_OPEN && this.lexer.peek()==='/')){
                children.push(this.parseChildren());
            }
            this.eat(TOKEN_TYPE.TAG_OPEN)
            this.eat(TOKEN_TYPE.TAG_CLOSE_SLASH);
            this.eat(TOKEN_TYPE.STRING);
            this.eat(TOKEN_TYPE.TAG_CLOSE);
            return new HtmlElement(tagNAme, attributes, children);
        }
    }

    parse() : astNode[]{
        const nodes:astNode[] = [];
        while(this.currentToken.tokenType!==TOKEN_TYPE.END_OF_FILE){
            nodes.push(this.parseTag());
        }
        return nodes;
    }
}