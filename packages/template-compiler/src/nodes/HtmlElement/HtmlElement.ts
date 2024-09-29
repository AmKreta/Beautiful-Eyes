import { Visitor } from "../../visitors/visitor/visitor";
import { astNode } from "../astNode/astNode";
import { HtmlAttribute } from "../HtmlAttribute/HtmlAttribute";
import { htmlChildren } from "../HtmlChild/htmlChild";

export class HtmlElement extends astNode{
    constructor(
        public tagName:string,
        public attributes:HtmlAttribute[] = [],
        public children:htmlChildren = [],
        public eventHandlers:HtmlAttribute[] = [],
        public ref:HtmlAttribute | null = null
    ){
        super();
    }

    acceptVisitor(visitor: Visitor){
       return visitor.visitHtmlElement(this);
    }
}