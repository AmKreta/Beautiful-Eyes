import { HtmlAttribute } from "../../nodes/HtmlAttribute/HtmlAttribute";
import { HtmlChild } from "../../nodes/HtmlChild/htmlChild";
import { HtmlElement } from "../../nodes/HtmlElement/HtmlElement";

export abstract class Visitor{
    abstract visitHtmlElement(htmlElement:HtmlElement):any;
    abstract visitHtmlAttribute(htmlAttribute:HtmlAttribute):any;
    abstract visitHtmlChild(htmlChild:HtmlChild):any;
    abstract eval():any;
};