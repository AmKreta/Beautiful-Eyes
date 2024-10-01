import { HtmlObj } from "@beautiful-eyes/lib/types/types"
import { View } from "../View/view.class";

type ComponentOptions = {
    useTemplate:HtmlObj[],
    useStyleSheets:string[]
}

type Constructor<T = {}> = new(...arga:any[])=>T;

export interface IComponent{
    view:View;
    template:HtmlObj[];
    nodeTree:any;
    reactiveElements:Map<HTMLElement, Function>;
    init:()=>void;
    _HtmlParent:HTMLElement;
}

export default function Component(options:ComponentOptions){
    return function<T extends Constructor>(target:T, context:ClassDecoratorContext):T{
        class Component extends target implements IComponent{
            static _template:HtmlObj[] = options.useTemplate;
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

        return Component;
    }
}