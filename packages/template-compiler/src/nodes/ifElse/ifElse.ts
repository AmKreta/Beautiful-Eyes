import { Visitor } from "../../visitors/visitor/visitor";
import { astNode } from "../astNode/astNode";
import { Interpolation } from "../interpolation/interpolation";

export type IfElseCondition = [Interpolation | null, astNode[]];
export type IfElseConditions = IfElseCondition[];

export class IfElse extends astNode{

    constructor(
        private conditions:IfElseConditions
    ){
        super();
    }

    acceptVisitor(visitor:Visitor){
        const nodes:[Interpolation, astNode[]][] = [];
        this.conditions.forEach(([condition, astNodes])=>{
            let n:any = [];
            astNodes.forEach(node=>n.push(node.acceptVisitor(visitor)));
            nodes.push([condition, n] as any);
        })
        return {
            directiveName:'if',
            nodes
        };
    }
}