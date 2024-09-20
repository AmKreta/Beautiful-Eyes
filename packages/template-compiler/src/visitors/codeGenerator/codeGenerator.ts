import { astNode } from "../../nodes/astNode/astNode";
import { HtmlAttribute } from "../../nodes/HtmlAttribute/HtmlAttribute";
import { HtmlChild } from "../../nodes/HtmlChild/htmlChild";
import { HtmlElement } from "../../nodes/HtmlElement/HtmlElement";
import { Visitor } from "../visitor/visitor";

export class CodeGenerator extends Visitor{
    visitHtmlElement(htmlElement:HtmlElement){
        return htmlElement.acceptVisitor(this);
    }

    visitHtmlAttribute(htmlAttribute:HtmlAttribute){
        return htmlAttribute.acceptVisitor(this);
    }

    visitHtmlChild(htmlChild:HtmlChild){
        return htmlChild.acceptVisitor(this);
    }

    eval(nodes:astNode[]){
        return nodes.map(node=>node.acceptVisitor(this));
    }
};