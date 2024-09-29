import { Visitor } from "../../visitors/visitor/visitor";

export abstract class astNode{
    abstract acceptVisitor(visitor:Visitor):any;
}