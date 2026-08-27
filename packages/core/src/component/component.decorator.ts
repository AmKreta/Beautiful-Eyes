import { BE_Node, BE_Nodes, HtmlObj } from "@beautiful-eyes/lib"
import { View } from "../View/view.class";
import { ComponentRegistry } from "./componentRegistry";

type ComponentOptions = {
    selector:string,
    useTemplate:BE_Nodes,
    useStyleSheets:string[]
}

type Constructor<T = {}> = new(...arga:any[])=>T;

export interface IComponent{
    view:View;
    template:BE_Nodes;
    nodeTree:any;
    reactiveElements:Map<HTMLElement, Function>;
    init:()=>void;
    _HtmlParent:HTMLElement;
}

export default function Component(options:ComponentOptions){
    return function<T extends Constructor>(target:T, context:ClassDecoratorContext):T{
        class Component extends target implements IComponent{
            static _template:BE_Nodes = options.useTemplate;
            nodeTree:any;
            reactiveElements:Map<HTMLElement, Function> = new Map();
            _HtmlParent: HTMLElement = document.body;
            view:View = new View(this, this._HtmlParent);
            
            constructor(...props:any[]){
                super(...props);
                this.init();
            }

            init(){
                if(!this.template) throw new Error("template is required for " + context.name);
                (this as any).addOtherSubscription?.(()=>{
                    this.reactiveElements.forEach((fn:Function,element:HTMLElement) => {
                        fn.call(this);
                    });
                });
            }

            destroyed(){

            }

            get template(){
                return Component._template;
            }

            private setHtmlParent(el:HTMLElement){
                this._HtmlParent = el;
            }
        }

        if(ComponentRegistry.has(options.selector)){
            throw new Error(`a component with selector "${options.selector}" is already registered`);
        }
        ComponentRegistry.set(options.selector, Component);

        return Component;
    }
}