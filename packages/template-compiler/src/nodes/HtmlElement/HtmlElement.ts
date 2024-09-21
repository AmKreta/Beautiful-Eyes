import { HtmlObj } from "@beautiful-eyes/lib/types/types"
import { Visitor } from "../../visitors/visitor/visitor";
import { astNode } from "../astNode/astNode";
import { HtmlAttribute } from "../HtmlAttribute/HtmlAttribute";
import { HtmlChild } from "../HtmlChild/htmlChild";

export class HtmlElement extends astNode{
    constructor(
        private tagName:string,
        private attributes:HtmlAttribute[] = [],
        private children:(HtmlChild | HtmlElement)[] = [],
        private eventHandlers:HtmlAttribute[] = [],
        private ref:HtmlAttribute | null = null
    ){
        super();
    }

    acceptVisitor(visitor: Visitor) :HtmlObj{
        const attributes:Record<string, string>={};
        this.attributes.forEach(attr=>{
            const {attributeName, attributeValue} = attr.acceptVisitor(visitor);
            attributes[attributeName] = attributeValue;
        });

        const eventHandlers:Record<string, string>={};
        this.eventHandlers.forEach(attr=>{
            const {attributeName, attributeValue} = attr.acceptVisitor(visitor);
            eventHandlers[attributeName] = attributeValue as any;
        });

        let ref:any = null;
        if(this.ref){
            let {attributeName} = this.ref?.acceptVisitor(visitor);
            ref = attributeName;
        }

        const children:(HtmlObj | string)[]= [];
        this.children.forEach(child=>{
            children.push(child.acceptVisitor(visitor));
        });

        return {
            tagName: this.tagName,
            attributes,
            eventHandlers,
            ref,
            children,
        };
    }
}