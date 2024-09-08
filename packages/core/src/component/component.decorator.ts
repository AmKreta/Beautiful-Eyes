
type ComponentOptions = {
    useTemplate:string,
    useStyleSheets:string[]
}

type Constructor<T = {}> = new(...arga:any[])=>T;

export default function Component(options:ComponentOptions){
    return function<T extends Constructor>(target:T, context:ClassDecoratorContext):T{
        console.log(options)
        return target;
    }
}