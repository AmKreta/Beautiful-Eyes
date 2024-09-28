import { Lexer } from "../lexer/lexer";
import { astNode } from "../nodes/astNode/astNode";
import { ATTRIBUTE_TYPE, HtmlAttribute } from "../nodes/HtmlAttribute/HtmlAttribute";
import { HtmlChild } from "../nodes/HtmlChild/htmlChild";
import { HtmlElement } from "../nodes/HtmlElement/HtmlElement";
import { IfElse, IfElseConditions } from "../nodes/ifElse/ifElse";
import { Token, TOKEN_TYPE, TOKEN_VALUE } from "../token";

export class Parser {
    currentToken: Token;
    constructor(
        private lexer: Lexer
    ) {
        this.currentToken = this.lexer.getNextToken();
    }

    eat(expectedToken: TOKEN_TYPE) {
        if (this.currentToken.tokenType === expectedToken) {
            this.currentToken = this.lexer.getNextToken();
        }
        else {
            throw new Error(`expected ${TOKEN_VALUE[expectedToken]} got ${TOKEN_VALUE[this.currentToken.tokenType]}`);
        }
    }

    parseChildren() {
        switch (this.currentToken.tokenType) {
            case TOKEN_TYPE.STRING: {
                const content = this.currentToken.value;
                this.eat(TOKEN_TYPE.STRING);
                return new HtmlChild(content);
            }
            case TOKEN_TYPE.INTERPOLATION: {
                const content = this.currentToken.value;
                this.eat(TOKEN_TYPE.INTERPOLATION);
                return new HtmlChild(content, true);
            }
            case TOKEN_TYPE.TAG_OPEN:
                return this.parseTag();
            default:
                throw new Error(`while parsing children, expected string, interpolation or htmlElements got ${this.currentToken.value}`);
        }
    }

    parseAttribute() {
        let isEventListener = false, isRef = false;
        if (this.currentToken.value.startsWith('@')) {
            this.currentToken.value
            isEventListener = true;
            this.currentToken.value = this.currentToken.value.slice(1);
        }
        else if (this.currentToken.tokenType.startsWith('#')) {
            isRef = true;
            this.eat(TOKEN_TYPE.HASH);
            this.currentToken.value = this.currentToken.value.slice(1);
        }
        const attributeName = this.currentToken.value;
        this.eat(TOKEN_TYPE.ATTRIBUTE_NAME);
        if (isRef) {
            return new HtmlAttribute(attributeName, '', false, ATTRIBUTE_TYPE.REF);
        }
        this.eat(TOKEN_TYPE.ASSIGNMENT);
        const tagType = isEventListener ? ATTRIBUTE_TYPE.EVENT_HANDLER : ATTRIBUTE_TYPE.VALUE;
        if (this.currentToken.isInterpolation) {
            const val = this.currentToken.value;
            this.eat(TOKEN_TYPE.ATTRIBUTE_VALUE);
            return new HtmlAttribute(attributeName, val, true, tagType);
        }
        else{
            const val = this.currentToken.value;
            this.eat(TOKEN_TYPE.ATTRIBUTE_VALUE);
            return new HtmlAttribute(attributeName, val, false, tagType);
        }
    }

    parseTag() {
        this.eat(TOKEN_TYPE.TAG_OPEN);
        const tagNAme = this.currentToken.value;
        this.eat(TOKEN_TYPE.TAG_NAME);
        const attributes: HtmlAttribute[] = [];
        const eventHandlers: HtmlAttribute[] = [];;
        let ref: HtmlAttribute | null = null;
        while (this.currentToken.tokenType !== TOKEN_TYPE.TAG_CLOSE) {
            const attr = this.parseAttribute();
            if (attr.attributeType === ATTRIBUTE_TYPE.EVENT_HANDLER) {
                eventHandlers.push(attr);
            }
            else if (attr.attributeType === ATTRIBUTE_TYPE.REF) {
                if (ref) throw new Error('an element can contain only one ref');
                else ref = attr;
            }
            else {
                attributes.push(attr);
            }
            if (this.currentToken.tokenType === TOKEN_TYPE.TAG_CLOSE_SLASH) {
                this.eat(TOKEN_TYPE.TAG_CLOSE_SLASH);
                this.eat(TOKEN_TYPE.TAG_CLOSE);
                return new HtmlElement(tagNAme, attributes, [], eventHandlers, null);
            }
        }
        this.eat(TOKEN_TYPE.TAG_CLOSE);
        const children: (HtmlChild | HtmlElement)[] = [];
        while (!((this.currentToken.tokenType as any) === TOKEN_TYPE.TAG_OPEN && this.lexer.peek() === '/')) {
            children.push(this.parseChildren());
        }
        this.eat(TOKEN_TYPE.TAG_OPEN)
        this.eat(TOKEN_TYPE.TAG_CLOSE_SLASH);
        this.eat(TOKEN_TYPE.TAG_NAME);
        this.eat(TOKEN_TYPE.TAG_CLOSE);
        return new HtmlElement(tagNAme, attributes, children, eventHandlers, ref);

    }

    parseIfElse() {
        const conditions: IfElseConditions = [];
        // readinf if
        this.eat(TOKEN_TYPE.IF);
        this.eat(TOKEN_TYPE.PARENTHESIS_OPEN);
        let interpolation = this.currentToken.value;
        this.eat(TOKEN_TYPE.INTERPOLATION);
        this.eat(TOKEN_TYPE.PARENTHESIS_CLOSE);
        this.eat(TOKEN_TYPE.CURLEY_BRACKET_OPEN);
        let body = this.parse(TOKEN_TYPE.CURLEY_BRACKET_CLOSE);
        this.eat(TOKEN_TYPE.CURLEY_BRACKET_CLOSE);
        conditions.push([interpolation, body]);

        if (this.currentToken.tokenType !== TOKEN_TYPE.AT_THE_RATE) {
            return new IfElse(conditions);
        }

        // reading if-else
        while ((this.currentToken.tokenType as any) === TOKEN_TYPE.AT_THE_RATE && this.lexer.peek(7) === TOKEN_VALUE[TOKEN_TYPE.ELSE_IF]) {
            this.eat(TOKEN_TYPE.AT_THE_RATE)
            this.eat(TOKEN_TYPE.ELSE_IF);
            this.eat(TOKEN_TYPE.PARENTHESIS_OPEN);
            const interpolation = this.currentToken.value;
            this.eat(TOKEN_TYPE.INTERPOLATION);
            this.eat(TOKEN_TYPE.PARENTHESIS_CLOSE);
            this.eat(TOKEN_TYPE.CURLEY_BRACKET_OPEN);
            const body = this.parse(TOKEN_TYPE.CURLEY_BRACKET_CLOSE);
            this.eat(TOKEN_TYPE.CURLEY_BRACKET_CLOSE);
            conditions.push([interpolation, body]);
        }

        if (this.currentToken.tokenType !== TOKEN_TYPE.AT_THE_RATE || this.lexer.peek(4) !== 'else') {
            return new IfElse(conditions);
        }

        // reading else
        this.eat(TOKEN_TYPE.AT_THE_RATE);
        this.eat(TOKEN_TYPE.ELSE);
        this.eat(TOKEN_TYPE.CURLEY_BRACKET_OPEN);
        body = this.parse(TOKEN_TYPE.CURLEY_BRACKET_CLOSE);
        this.eat(TOKEN_TYPE.CURLEY_BRACKET_CLOSE);
        conditions.push(['', body]);
        return new IfElse(conditions);
    }

    parseFor() {
        //@for(let [key, val] : obj){}
        // {key, val, interpolation} []

    }

    parseSwitch() {

    }

    parsePortal() {

    }

    parseStructuralDirective(): any {
        if (!(this.currentToken.tokenType === TOKEN_TYPE.AT_THE_RATE)) {
            throw new Error(`expected @ gor ${this.currentToken.value}`);
        }
        this.eat(TOKEN_TYPE.AT_THE_RATE);
        switch (this.currentToken.tokenType as any) {
            case TOKEN_TYPE.IF: return this.parseIfElse();
            case TOKEN_TYPE.FOR: return this.parseFor();
            case TOKEN_TYPE.SWITCH: return this.parseSwitch();
            case TOKEN_TYPE.ELSE_IF: throw new Error('@else-if needs a parent @if statement');
            case TOKEN_TYPE.ELSE: throw new Error('@else needs a parent @if or @else-if statement');
            case TOKEN_TYPE.CASE: throw new Error('@case needs a parent @switch statement');
        }
    }

    parse(delimeter = TOKEN_TYPE.END_OF_FILE): astNode[] {
        const nodes: astNode[] = [];
        while (this.currentToken.tokenType !== delimeter) {
            switch (this.currentToken.tokenType) {
                case TOKEN_TYPE.AT_THE_RATE:
                    nodes.push(this.parseStructuralDirective());
                    break;
                case TOKEN_TYPE.STRING:
                    this.currentToken.value && nodes.push(new HtmlElement('textNode', [], [new HtmlChild(this.currentToken.value)]));
                    break;
                case TOKEN_TYPE.TAG_OPEN:
                    nodes.push(this.parseTag());
                    break;
                default:
                    throw new Error('undefined token ' + this.currentToken.value);
            }
        }
        return nodes;
    }
}