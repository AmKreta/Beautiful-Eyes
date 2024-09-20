import { Visitor } from "../../visitors/visitor/visitor";
import { astNode } from "../astNode/astNode";

export class HtmlAttribute extends astNode{
    constructor(
        private attributeName:string,
        private tagValue: string,
        private isInterpolation:boolean = false
    ){
        super();
    }

    acceptVisitor(visitor: Visitor) {
        let val = this.isInterpolation ? `function(){return ${this.tagValue}}` : this.tagValue;
        return {
            attributeName:this.attributeName,
            attributeValue:val
        }
    }
}