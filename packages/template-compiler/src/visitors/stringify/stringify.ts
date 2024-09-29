import { astNode } from "../../nodes/astNode/astNode";
import { HtmlAttribute } from "../../nodes/HtmlAttribute/HtmlAttribute";
import { HtmlElement } from "../../nodes/HtmlElement/HtmlElement";
import { IfElse } from "../../nodes/ifElse/ifElse";
import { Interpolation } from "../../nodes/interpolation/interpolation";
import { Visitor } from "../visitor/visitor";
import { NODE_OBJ_TYPE } from "../../types/types";
import interpolationTranspiler from "../../interpolationTranspiler/interpolationTranspiler";
import { StringNode } from "../../nodes/string/string";
import { Ref } from "../../nodes/ref/ref.component";

export class Stringify extends Visitor{

    genTab(tab = 0){
        let str = '', i=0;
        while(i<tab) str+='\t';
        return str;
    }

    visitHtmlAttribute(htmlAttribute: HtmlAttribute, tab = 0){
        let str = this.genTab(tab);
        str+=`${htmlAttribute.attributeName}: ${htmlAttribute.attributeValue.acceptVisitor(this)},\n`;
        return str;
    }

    visitInterpolation(interpolation:Interpolation, tab = 0){
        let str = this.genTab(tab);
        str+=`function(){return ${interpolationTranspiler(interpolation.content)}}\n`;
        return str;
    }

    visitRef(ref: Ref, tab?: number) {
        let str = this.genTab(tab);
        str+=`${ref.name},\n`;
        return str;
    }

    visitStringNode(stringNode:StringNode, tab = 0){
        let str = this.genTab(tab);
        str+=`${stringNode.content},\n`;
        return str;
    }

    visitHtmlElement(htmlElement:HtmlElement, tab = 0){
        let str = `${this.genTab(tab)}{\n`;
        str+=`${this.genTab(tab+1)}type: ${NODE_OBJ_TYPE.HTML_ELEMENT},\n`;
        str+=`${this.genTab(tab+1)}name: ${htmlElement.tagName},\n`;
        str+=`${this.genTab(tab+1)}ref: ${htmlElement.ref},\n`;
        str+=`${this.genTab(tab+1)}attributes: {\n`;
        htmlElement.attributes.forEach(attr=>str+=`${attr.acceptVisitor(this, tab+2)}`);
        str+=`${this.genTab(tab+1)}},\n`;
        str+=`${this.genTab(tab+1)}eventHandlers:{\n`;
        htmlElement.eventHandlers.forEach(attr=>str+=`${attr.acceptVisitor(this, tab+2)}`);
        str+=`${this.genTab(tab+1)}},\n`;
        if(htmlElement.ref) str+= htmlElement.ref.acceptVisitor(this, tab+1);
        str+=`${this.genTab(tab+1)}children: [\n`
        htmlElement.children.map(child=>str+=child.acceptVisitor(this, tab+2));
        str+=`${this.genTab(tab+1)}],\n`;
        return str+`${this.genTab(tab)}},\n`;
    }

    visitIfElse(ifElse:IfElse, tab = 0){
        let str = `${this.genTab(tab)}{\n`;
        str+=`${this.genTab(tab+1)}type: ${NODE_OBJ_TYPE.DIRECTIVE},\n`;
        str+=`${this.genTab(tab+1)}name: ${'ifElse'},\n`;
        str+=`${this.genTab(tab+1)}children: [\n`;
        ifElse.conditions.forEach(([condition, astNodes])=>{
            let s = '';
            s+= `${this.genTab(tab+1)}[\n${condition?.acceptVisitor(this, tab+2) || this.genTab(tab+2)+'null'},\n`
            s+=`${this.genTab(tab+1)} [\n`;
            astNodes.forEach(node=>str+=` ${node.acceptVisitor(this, tab+2)},\n`);
            s+=`${this.genTab(tab+1)} ],\n`;
        });
        return str+`${this.genTab(tab)}},\n`;
    }

    eval(nodes:astNode[], tab = -1){
        return nodes.map(node=>node.acceptVisitor(this, tab+1));
    }
};