import { AttributeObj, BE_Node, BE_Nodes, DirectiveObj, EventHandlerObject, HtmlObj, IfElse, Interpolation, NODE_OBJ_TYPE } from "@beautiful-eyes/lib";
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
            if(!obj) continue;
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
        this.setCommentNodeProperty(comment, 'nodeChild', nodeRoot);
        // queue microtask runs before next render and macrotask and io
        // dom is updated till now, but not rendered, so appensing all if-else blocks before rendering
        queueMicrotask(()=>this.appendChildrenToParent(nodeRoot, comment));
        this.component.reactiveElements.set(comment as any, ()=>{
            const currentInterpolationIndex = this.getIfElseTrueConditionIndex(directive.children);
            if(currentInterpolationIndex === lastIndex) return;
            nodeRoot.forEach(node=>this.unMountNode(node));
            nodeRoot = this.mountIfElseBodyWithIndex(directive.children, currentInterpolationIndex);
            this.setCommentNodeProperty(comment, 'nodeChild', nodeRoot);
            lastIndex = currentInterpolationIndex;
            queueMicrotask(()=>this.appendChildrenToParent(nodeRoot, comment));
        });
        return comment;
    }

    private setCommentNodeProperty(node:Comment, key:string, value:any){
        (node as any)[key] = value;
    }

    private getCommentNodeProperty(node:Comment, key:string){
        return (node as any)[key];
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
        if(index==-1) return [];
        const nodeArray = ifElse[index][1];
        return this.buildNodeTree(nodeArray);
    }

    private mountIfElseBody(ifElse:IfElse):[number, (HTMLElement | Text | Comment)[]]{
        for(let i = 0; i<ifElse.length; i++){
            const [interpolation, nodeArray] = ifElse[i];
            if(!interpolation || interpolation.call(this.component)){
                return [i, this.buildNodeTree(nodeArray)];
            }
        }
        return [-1, []];
    }

    unMountNode(el:HTMLElement | Text | Comment){
        if(el instanceof Comment){
            const nodes = this.getCommentNodeProperty(el, 'nodeChild');
            nodes.forEach((node:any)=>this.unMountNode(node));
        }
        this.removeFromReactiveElements(el);
        el.remove();
    }

    removeFromReactiveElements(el:HTMLElement | Text | Comment){
        if(el.childNodes){
            el.childNodes.forEach(child=>{
                // optimize this
                this.removeFromReactiveElements(child as any);
            });
        }
        this.component.reactiveElements.delete(el as any);
    }

    appendChildrenToParent(children:(HTMLElement | Comment | Text)[], parent:HTMLElement | Comment | Text){
        if(!parent) return children;
        if(parent instanceof Comment){
            // add chidren only when mounted
            parent.parentNode && children.forEach(child=>{
                parent.after(child)
                if(child instanceof Comment){
                    const nodes = this.getCommentNodeProperty(child, 'nodeChild');
                    this.appendChildrenToParent(nodes, child);
                }
            });
        }
        else children.forEach(child=>{
            parent.appendChild(child)
        });
        return parent;
    }
}