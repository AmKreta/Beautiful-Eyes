import { Visitor } from "../../visitors/visitor/visitor";
import { astNode } from "../astNode/astNode";

export type IfElseConditions = [string, astNode[]][]

export class IfElse extends astNode{

    constructor(
        private conditions:IfElseConditions
    ){
        super();
    }

    acceptVisitor(visitor:Visitor){

    }


}