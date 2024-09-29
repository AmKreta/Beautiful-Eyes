import { Visitor } from "../../visitors/visitor/visitor";
import { astNode } from "../astNode/astNode";

export  class Ref extends astNode{

    constructor(public name:string){
        super();
    }

    acceptVisitor(visitor: Visitor) {
        return this.name;
    }
}