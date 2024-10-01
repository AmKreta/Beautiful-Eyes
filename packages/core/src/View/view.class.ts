import { AttributeObj, BE_Node, DirectiveObj, EventHandlerObject, HtmlObj, IfElse, Interpolation, NODE_OBJ_TYPE } from "@beautiful-eyes/lib";
import { IComponent } from "../component/component.decorator";

export class View{

    root:HTMLElement[] = [];
    updatorFunctions:{context: IComponent, function:Function[]}[] = [];

    constructor(private component:IComponent, private parentEl:HTMLElement){
        this.root = this.template.map((htmltemplate:BE_Node)=>this.buildNodeTree(htmltemplate, parentEl)) as any;
    }

    private get template(){
        return this.component.template;
    }

    private buildNodeTree(obj:BE_Node, parent?:HTMLElement){
        if(typeof obj === 'string') return this.buildStringNode(obj, parent);
        else if(typeof obj === 'function') return this.buildInterpolationNode(obj, parent);
        else if(obj.type === NODE_OBJ_TYPE.HTML_ELEMENT) return this.buildHtmlElement(obj, parent);
        else if(obj.type === NODE_OBJ_TYPE.DIRECTIVE) return this.buildDirectives(obj, parent);
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

    private buildDirectives(directive:DirectiveObj, parent?:HTMLElement){
        if(directive.name === "ifElse") return this.addIfElseDirective(directive, parent);
    }

    private addIfElseDirective(directive:DirectiveObj, parent?:HTMLElement){
        const comment = document.createComment('if');
        parent?.appendChild(comment);
        let [lastIndex, nodeRoot] = this.mountIfElseBody(directive.children);
        (nodeRoot as any).forEach((element:HTMLElement) => parent?.appendChild(element));
        this.component.reactiveElements.set(comment as any, ()=>{
            const currentInterpolationIndex = this.getIfElseTrueConditionIndex(directive.children);
            if(currentInterpolationIndex === lastIndex) return;
            nodeRoot.forEach(node=>this.unMountNode(node));
            const elements = this.mountIfElseBodyWithIndex(directive.children, currentInterpolationIndex);
            lastIndex = currentInterpolationIndex;
            nodeRoot = elements;
            (nodeRoot as any).forEach((element:HTMLElement) => parent?.appendChild(element));
        });
        return comment;
    }

    private getIfElseTrueConditionIndex(ifElse:IfElse){
        for(let i = 0; i<ifElse.length; i++){
            const [interpolation, nodeArray] = ifElse[i];
            if(!interpolation || interpolation.call(this.component)){
                return i;
            }
        }
        return -1;
    }

    private mountIfElseBodyWithIndex(ifElse:IfElse, index:number){
        if(index==-1){
            return [];
        }
        const nodeArray = ifElse[index][1];
        return nodeArray.map(node=>this.buildNodeTree(node)) as any;
    }

    private mountIfElseBody(ifElse:IfElse):[number, HTMLElement[]]{
        const lastIndex = ifElse.length-1;
        for(let i = 0; i<lastIndex; i++){
            const [interpolation, nodeArray] = ifElse[i];
            if(!interpolation || interpolation.call(this.component)){
                // if, else-if
                return [i, nodeArray.map(node=>this.buildNodeTree(node)) as any];
            }
        }
        // else part
        // const [interpolation, nodeArray] = ifElse[lastIndex];
        return [-1, []];
    }

    unMountNode(el:HTMLElement | Text){
        this.removeFromReactiveElements(el);
        el.remove();
    }

    removeFromReactiveElements(el:HTMLElement | Text){
      el.childNodes.forEach(child=>{
        // optimize this
        this.removeFromReactiveElements(child as any);
      });
      this.component.reactiveElements.delete(el as any);
    }
}