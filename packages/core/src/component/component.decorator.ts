import buildNodeTree from "../buildNodeTree/buildNodeTree";
import loadTemplate from "../loadTemplate/loadTemplate";
import {IHtmlObj} from '@beautiful-eyes/lib';

type ComponentOptions = {
    useTemplate:string | IHtmlObj,
    useStyleSheets:string[]
}

type Constructor<T = {}> = new(...arga:any[])=>T;

export default function Component(options:ComponentOptions){
    return function<T extends Constructor>(target:T, context:ClassDecoratorContext):T{
        class Component extends target{
            static template:IHtmlObj | null = null;
            nodeTree:any;
            
            constructor(...props:any[]){
                super(...props);
            }

            async init(){
                Component.template = await loadTemplate(options.useTemplate);
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