import { HtmlAttribute } from "../../nodes/HtmlAttribute/HtmlAttribute";
import { HtmlChild } from "../../nodes/HtmlChild/htmlChild";
import { HtmlElement } from "../../nodes/HtmlElement/HtmlElement";
import { Visitor } from "../visitor/visitor";

export class CodeGenerator extends Visitor{
    visitHtmlElement(htmlElement:HtmlElement){}
    visitHtmlAttribute(htmlAttribute:HtmlAttribute){}
    visitHtmlChild(htmlChild:HtmlChild){}
    eval(){}
};