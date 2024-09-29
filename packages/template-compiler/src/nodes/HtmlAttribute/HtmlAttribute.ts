import interpolationTranspiler from "../../interpolationTranspiler/interpolationTranspiler";
import { Visitor } from "../../visitors/visitor/visitor";
import { astNode } from "../astNode/astNode";
import { Interpolation } from "../interpolation/interpolation";
import { Ref } from "../ref/ref.component";
import { StringNode } from "../string/string";

export enum ATTRIBUTE_TYPE{
    VALUE,
    REF,
    EVENT_HANDLER,
}

export class HtmlAttribute extends astNode{
    constructor(
        private attributeName:string,
        private attributeValue: StringNode | Interpolation | Ref,
        public attributeType:ATTRIBUTE_TYPE = ATTRIBUTE_TYPE.VALUE
    ){
        super();
    }

    acceptVisitor(visitor: Visitor) {
        return {
            attributeName:this.attributeName,
            attributeValue: this.attributeValue.acceptVisitor(visitor)
        }
    }
}