import { astNode } from "../../nodes/astNode/astNode";
import { HtmlAttribute } from "../../nodes/HtmlAttribute/HtmlAttribute";
import { HtmlElement } from "../../nodes/HtmlElement/HtmlElement";
import { StringNode } from "../../nodes/string/string";
import { Interpolation } from "../../nodes/interpolation/interpolation";
import { IfElse } from "../../nodes/ifElse/ifElse";
import { Ref } from "../../nodes/ref/ref.component";

export abstract class Visitor{
    abstract visitHtmlElement(htmlElement:HtmlElement):any;
    abstract visitHtmlAttribute(htmlAttribute:HtmlAttribute):any;
    abstract visitInterpolation(interpolation:Interpolation):string;
    abstract visitStringNode(stringNode:StringNode):any;
    abstract visitIfElse(ifElse:IfElse):any;
    abstract visitRef(ref:Ref):any;
    abstract eval(nodes:astNode[]):any;
};