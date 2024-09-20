import { astNode } from "../astNode/astNode";
import { HtmlElement } from "../HtmlElement/HtmlElement";

export class HtmlChild extends astNode{
    constructor(
        private content:string | HtmlElement,
        private isInterpolation:boolean = false,
        private isHtmlElement:boolean = false
    ){
        super();
    }
}