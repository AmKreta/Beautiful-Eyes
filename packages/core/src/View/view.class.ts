import { AttributeObj, BE_Node, EventHandlerObject, HtmlObj, Interpolation, NODE_OBJ_TYPE } from "@beautiful-eyes/lib";
import { IComponent } from "../component/component.decorator";

export class View{

    root:HTMLElement[] = [];
    updatorFunctions:{context: IComponent, function:Function[]}[] = [];

    constructor(private component:IComponent){
        this.root = this.template.map((htmltemplate:BE_Node)=>this.buildNodeTree(htmltemplate)) as any;
    }

    private get template(){
        return this.component.template;
    }

    private buildNodeTree(obj:BE_Node, parent?:HTMLElement){
        if(typeof obj === 'string') return this.buildStringNode(obj, parent);
        else if(typeof obj === 'function') return this.buildInterpolationNode(obj, parent);
        else if(obj.type === NODE_OBJ_TYPE.HTML_ELEMENT) return this.buildHtmlElement(obj, parent);
        else if(obj.type === NODE_OBJ_TYPE.DIRECTIVE){

        }
        else{
            
            // else if(Types.isComponent(tagName)){
    
            // }
            //throw new Error('component name is invalid '+ tagName);
        }
    }

    private buildStringNode(content:string, parent?:HTMLElement){
        const textNode = document.createTextNode(content);
        parent?.appendChild(textNode);
        return textNode;
    }

    private buildInterpolationNode(interpolation:Interpolation, parent?:HTMLElement){
        const text = interpolation.call(this.component);
        const textNode = document.createTextNode(text);
        parent?.appendChild(textNode);
        this.component.reactiveElements.set(textNode as any, ()=>{
            textNode.textContent = interpolation.call(this.component);
        });
        return textNode;
    }

    private buildHtmlElement(HtmlObj:HtmlObj, parent?:HTMLElement){
        const {name:tagName, attributes, children, eventHandlers} = HtmlObj;
        let el = document.createElement(tagName);
        this.addEventListeners(el, eventHandlers);
        this.addAttributes(el, attributes);
        HtmlObj.children.forEach(child=>this.buildNodeTree(child, el));
        parent?.appendChild(el);
        return el;
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

    updateAttribute(){

    }

    updateChild(){

    }
}