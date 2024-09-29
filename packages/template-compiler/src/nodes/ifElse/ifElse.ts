import { NODE_OBJ_TYPE } from "../../types/types";
import { Visitor } from "../../visitors/visitor/visitor";
import { astNode } from "../astNode/astNode";
import { Interpolation } from "../interpolation/interpolation";

export type IfElseCondition = [Interpolation | null, astNode[]];
export type IfElseConditions = IfElseCondition[];

export class IfElse extends astNode{

    constructor(
        public conditions:IfElseConditions
    ){
        super();
    }

    acceptVisitor(visitor:Visitor){
      return visitor.visitIfElse(this);
    }
}