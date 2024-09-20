import { Visitor } from "../../visitors/visitor/visitor";
import { astNode } from "../astNode/astNode";
import { HtmlAttribute } from "../HtmlAttribute/HtmlAttribute";
import { HtmlChild } from "../HtmlChild/htmlChild";

export class HtmlElement extends astNode{
    constructor(
        private tagName:string,
        private attributes:HtmlAttribute[] = [],
        private children:(HtmlChild | HtmlElement)[] = []
    ){
        super();
    }

    acceptVisitor(visitor: Visitor) {
        
    }
}