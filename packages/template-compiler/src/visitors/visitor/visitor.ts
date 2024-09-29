import { astNode } from "../../nodes/astNode/astNode";
import { HtmlAttribute } from "../../nodes/HtmlAttribute/HtmlAttribute";
import { HtmlElement } from "../../nodes/HtmlElement/HtmlElement";
import { StringNode } from "../../nodes/string/string";
import { Interpolation } from "../../nodes/interpolation/interpolation";
import { IfElse } from "../../nodes/ifElse/ifElse";
import { Ref } from "../../nodes/ref/ref.component";

export abstract class Visitor{
    abstract visitHtmlElement(htmlElement:HtmlElement, tab?:number):any;
    abstract visitHtmlAttribute(htmlAttribute:HtmlAttribute, tab?:number):any;
    abstract visitInterpolation(interpolation:Interpolation, tab?:number):string;
    abstract visitStringNode(stringNode:StringNode, tab?:number):any;
    abstract visitIfElse(ifElse:IfElse, tab?:number):any;
    abstract visitRef(ref:Ref, tab?:number):any;
    abstract eval(nodes:astNode[], tab?:number):any;
};