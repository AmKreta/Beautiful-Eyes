import interpolationTranspiler from "../../interpolationTranspiler/interpolationTranspiler";
import { Visitor } from "../../visitors/visitor/visitor";
import { astNode } from "../astNode/astNode";

export enum ATTRIBUTE_TYPE{
    VALUE,
    REF,
    EVENT_HANDLER,
}

export class HtmlAttribute extends astNode{
    constructor(
        private attributeName:string,
        private tagValue: string,
        private isInterpolation:boolean = false,
        public attributeType:ATTRIBUTE_TYPE = ATTRIBUTE_TYPE.VALUE
    ){
        super();
    }

    acceptVisitor(visitor: Visitor) {
        let val = this.isInterpolation ? `function(){return ${interpolationTranspiler(this.tagValue!)}}` : this.tagValue;
        return {
            attributeName:this.attributeName,
            attributeValue:val
        }
    }
}