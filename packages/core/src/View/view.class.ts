import { AttributeObj, BE_Node, DirectiveObj, EventHandlerObject, HtmlObj, IfElse, Interpolation, NODE_OBJ_TYPE } from "@beautiful-eyes/lib";
import { IComponent } from "../component/component.decorator";

export class View{

    root:(HTMLElement | Text | Comment)[] = [];
    updatorFunctions:{context: IComponent, function:Function[]}[] = [];

    constructor(private component:IComponent, private parentEl:HTMLElement){
        this.root = this.buildNodeTree();
    }

    private get template(){
        return this.component.template;
    }

    private buildNodeTree(template = this.template){
        let htmlNodes:(HTMLElement | Text | Comment)[] = [];
        for(let obj of template){
            if(typeof obj === 'string') htmlNodes.push(this.buildStringNode(obj));
            else if(typeof obj === 'function') htmlNodes.push(this.buildInterpolationNode(obj));
            else if(obj.type === NODE_OBJ_TYPE.HTML_ELEMENT) htmlNodes.push(this.buildHtmlElement(obj));
            else if(obj.type === NODE_OBJ_TYPE.DIRECTIVE) htmlNodes.push(this.buildDirectives(obj));
        }
        return htmlNodes;
    }

    private buildStringNode(content:string){
        const textNode = document.createTextNode(content);
        return textNode;
    }

    private buildInterpolationNode(interpolation:Interpolation){
        const text = interpolation.call(this.component);
        const textNode = document.createTextNode(text);
        this.component.reactiveElements.set(textNode as any, ()=>{
            textNode.textContent = interpolation.call(this.component);
        });
        return textNode;
    }

    private buildHtmlElement(HtmlObj:HtmlObj){
        const {name:tagName, attributes, children, eventHandlers} = HtmlObj;
        let el = document.createElement(tagName);
        this.addEventListeners(el, eventHandlers);
        this.addAttributes(el, attributes);
        const childNodes = this.buildNodeTree(HtmlObj.children);
        this.appendChildrenToParent(childNodes, el);
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

    private buildDirectives(directive:DirectiveObj){
        if(directive.name === "ifElse") return this.addIfElseDirective(directive);
        throw new Error('directive decleration not found');
    }

    private addIfElseDirective(directive:DirectiveObj){
        const comment = document.createComment('if');
        let [lastIndex, nodeRoot] = this.mountIfElseBody(directive.children);
        this.appendChildrenToParent(nodeRoot, comment);
        this.component.reactiveElements.set(comment as any, ()=>{
            const currentInterpolationIndex = this.getIfElseTrueConditionIndex(directive.children);
            if(currentInterpolationIndex === lastIndex) return;
            nodeRoot.forEach(node=>this.unMountNode(node));
            nodeRoot = this.mountIfElseBodyWithIndex(directive.children, currentInterpolationIndex);
            lastIndex = currentInterpolationIndex;
            this.appendChildrenToParent(nodeRoot, comment);
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
        return this.buildNodeTree(nodeArray);
    }

    private mountIfElseBody(ifElse:IfElse):[number, (HTMLElement | Text | Comment)[]]{
        const lastIndex = ifElse.length-1;
        for(let i = 0; i<lastIndex; i++){
            const [interpolation, nodeArray] = ifElse[i];
            if(!interpolation || interpolation.call(this.component)){
                // if, else-if
                return [i, this.buildNodeTree(nodeArray)];
            }
        }
        // else part
        // const [interpolation, nodeArray] = ifElse[lastIndex];
        return [-1, []];
    }

    unMountNode(el:HTMLElement | Text | Comment){
        this.removeFromReactiveElements(el);
        el.remove();
    }

    removeFromReactiveElements(el:HTMLElement | Text | Comment){
      el.childNodes.forEach(child=>{
        // optimize this
        this.removeFromReactiveElements(child as any);
      });
      this.component.reactiveElements.delete(el as any);
    }

    appendChildrenToParent(children:(HTMLElement | Comment | Text)[], parent:HTMLElement | Comment | Text){
        if(!parent) return children;
        if(parent instanceof Comment) children.forEach(child=>parent.after(child));
        else children.forEach(child=>parent.appendChild(child));
        return parent;
    }
}