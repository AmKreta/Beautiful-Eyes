import { AttributeObj, EventHandlerObject, HtmlObj } from "@beautiful-eyes/lib";
import { Types } from "@beautiful-eyes/lib/src/types/types";
import { IComponent } from "../component/component.decorator";

export class View{

    root:HTMLElement[] = [];
    updatorFunctions:{context: IComponent, function:Function[]}[] = [];

    constructor(private component:IComponent){
        this.root = this.template.map((htmltemplate:HtmlObj)=>this.buildNodeTree(htmltemplate));
    }

    private get template(){
        return this.component.template;
    }

    private buildNodeTree(htmlObj:HtmlObj){
        const {tagName, attributes, children, eventHandlers} = htmlObj;
        if(Types.isHtmlTag(tagName)){
            let el = document.createElement(tagName);
            this.addEventListeners(el, eventHandlers);
            this.addAttributes(el, attributes);
            this.addChildren(el, children);
            return el;
        }
        else if(Types.isComponent(tagName)){

        }
        throw new Error('component name is invalid '+ tagName);
    }

    private addAttributes(el:HTMLElement, attributes:AttributeObj){
        for(let key in attributes){
            let val = attributes[key];
            if(typeof val === 'function') val = val.call(this.component);
            if((el as any)[key]) (el as any)[key] = val;
            else el.setAttribute(key, val as string);
        }
    }

    private addEventListeners(el:HTMLElement, eventHandlers:EventHandlerObject){
        for(let key in eventHandlers){
            const handler = eventHandlers[key] as Function;
            let fn = handler.call(this.component);
            if(typeof fn === 'function') fn = fn.bind(this.component);
            el.addEventListener(key, fn);
        }
    }

    private addChildren(el:HTMLElement, children:HtmlObj['children']){
        for(let child of children){
            if(typeof child === 'string'){
                const textNode = document.createTextNode(child);
                el.appendChild(textNode);
            }
            else if(typeof child === 'function'){
                const text = child.call(this.component);
                const textNode = document.createTextNode(text);
                el.appendChild(textNode);
                this.component.reactiveElements.set(textNode as any, ()=>{
                    console.log(child, this.component)
                    textNode.textContent = child.call(this.component);
                    console.log('ran', textNode);
                })
            }
            else{ 
                el.appendChild(this.buildNodeTree(child))
            }
        }
    }

    updateAttribute(){

    }

    updateChild(){

    }
}