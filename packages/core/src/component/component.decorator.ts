import { HtmlObj } from "@beautiful-eyes/lib/types/types"

type ComponentOptions = {
    useTemplate:HtmlObj[],
    useStyleSheets:string[]
}

type Constructor<T = {}> = new(...arga:any[])=>T;

export default function Component(options:ComponentOptions){
    return function<T extends Constructor>(target:T, context:ClassDecoratorContext):T{
        class Component extends target{
            static template:HtmlObj[] = options.useTemplate;
            nodeTree:any;
            reactiveElements:Map<HTMLElement, Function> = new Map();
            
            constructor(...props:any[]){
                super(...props);
            }

            init(){
                if(!Component.template) throw new Error("template is required for " + context.name);
                const nodeTree = Component.template.map((htmlObj:HtmlObj)=>this.buildNodeTree(htmlObj));
                (this as any).addOtherSubscription?.(()=>{
                    this.reactiveElements.forEach((fn:Function,element:HTMLElement) => {
                        fn.call(this);
                    });
                });
                return nodeTree;
            }

            buildNodeTree(htmlObj:HtmlObj){
                const {tagName, attributes, children} = htmlObj;
                if(/^[a-z]$/.test(tagName[0])){
                    // element
                    let el = document.createElement(tagName);
                    for(let key in attributes){
                        const val = attributes[key];
                        if(key.startsWith('on')){
                            el.addEventListener(key.slice(2).toLocaleLowerCase(), (val as Function).call(this).bind(this))
                        }
                        else{
                            el.setAttribute(key, typeof val === 'function'? val.call(this) : val);
                        }
                    }
                    for(let child of children){
                        if(typeof child === 'string'){
                            const textNode = document.createTextNode(child);
                            el.appendChild(textNode);
                        }
                        else if(typeof child === 'function'){
                            const text = child.call(this);
                            const textNode = document.createTextNode(text);
                            el.appendChild(textNode);
                            this.reactiveElements.set(textNode as any, ()=>{
                                const val = child.call(this);
                                textNode.nodeValue = child.call(this);
                            })
                        }
                        else{ 
                            el.appendChild(this.buildNodeTree(child))
                        }
                    }
                    return el;
                }
                else if(/^[A-Z]$/.test(tagName[0])){
                    // component
                }
                throw new Error('component name is invalid '+ tagName);
            }

            destroyed(){

            }
        }

        return Component;
    }
}