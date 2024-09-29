import { Visitor } from "../../visitors/visitor/visitor";
import { astNode } from "../astNode/astNode";

export class StringNode extends astNode{

    constructor(public content:string){
        super();
    }

    acceptVisitor(visitor: Visitor) {
        return `"${this.content}"`;
    }
}