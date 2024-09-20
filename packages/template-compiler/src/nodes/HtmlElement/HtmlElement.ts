import { htmlObj } from "@beautiful-eyes/lib/types/types"
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
        const attributes:Record<string, string>={};
        this.attributes.forEach(attr=>{
            const {attributeName, attributeValue} = attr.acceptVisitor(visitor);
            attributes[attributeName] = attributeValue;
        });
        const children:(htmlObj | string)[]= [];
        this.children.forEach(child=>{
            children.push(child.acceptVisitor(visitor));
        });
        return {
            tagName: this.tagName,
            attributes,
            children
        };
    }
}