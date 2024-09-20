import { htmlObj } from "@beautiful-eyes/lib/types/types"
import buildNodeTree from "../buildNodeTree/buildNodeTree";

type ComponentOptions = {
    useTemplate:htmlObj,
    useStyleSheets:string[]
}

type Constructor<T = {}> = new(...arga:any[])=>T;

export default function Component(options:ComponentOptions){
    return function<T extends Constructor>(target:T, context:ClassDecoratorContext):T{
        class Component extends target{
            static template:htmlObj = options.useTemplate;
            nodeTree:any;
            
            constructor(...props:any[]){
                super(...props);
            }

            init(){
                if(!Component.template) throw new Error("template is required for " + context.name);
                this.nodeTree = buildNodeTree(Component.template);
            }

            mounted(){
                this.parentClass.mounted();
            }

            async destroyed(){

            }

            get parentClass(){
                return (this as any).__proto__.__proto__;
            }
        }

        return Component;
    }
}