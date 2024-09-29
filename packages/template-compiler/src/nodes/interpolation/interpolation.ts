import interpolationTranspiler from "../../interpolationTranspiler/interpolationTranspiler";
import { Visitor } from "../../visitors/visitor/visitor";
import { astNode } from "../astNode/astNode";

export class Interpolation extends astNode{
    constructor(public content:string){
        super();
    }

    acceptVisitor(visitor: Visitor) {
       return visitor.visitInterpolation(this);
    }
}