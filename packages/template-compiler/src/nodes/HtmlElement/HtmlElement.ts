import { AttributeObj, EventHandlerObject } from "@beautiful-eyes/lib"
import { Visitor } from "../../visitors/visitor/visitor";
import { astNode } from "../astNode/astNode";
import { HtmlAttribute } from "../HtmlAttribute/HtmlAttribute";
import { htmlChildren } from "../HtmlChild/htmlChild";
import { NODE_OBJ_TYPE } from "../../types/types";

export class HtmlElement extends astNode{
    constructor(
        private tagName:string,
        private attributes:HtmlAttribute[] = [],
        private children:htmlChildren = [],
        private eventHandlers:HtmlAttribute[] = [],
        private ref:HtmlAttribute | null = null
    ){
        super();
    }

    acceptVisitor(visitor: Visitor){
        const attributes:AttributeObj={};
        this.attributes.forEach(attr=>{
            const {attributeName, attributeValue} = attr.acceptVisitor(visitor);
            attributes[attributeName] = attributeValue;
        });

        const eventHandlers:EventHandlerObject={};
        this.eventHandlers.forEach(attr=>{
            const {attributeName, attributeValue} = attr.acceptVisitor(visitor);
            eventHandlers[attributeName] = attributeValue as any;
        });

        let ref:any = null;
        if(this.ref){
            let {attributeName} = this.ref?.acceptVisitor(visitor);
            ref = attributeName;
        }

        const children:any = this.children.map(child=>child.acceptVisitor(visitor));

        return {
            type: NODE_OBJ_TYPE.HTML_ELEMENT,
            name: this.tagName,
            attributes,
            eventHandlers,
            ref,
            children,
        };
    }
}