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
        public attributeName:string,
        public attributeValue: StringNode | Interpolation | Ref,
        public attributeType:ATTRIBUTE_TYPE = ATTRIBUTE_TYPE.VALUE
    ){
        super();
    }

    acceptVisitor(visitor: Visitor, tab?:number) {
        return visitor.visitHtmlAttribute(this, tab);
    }
}