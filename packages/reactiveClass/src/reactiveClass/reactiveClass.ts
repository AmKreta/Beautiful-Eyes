export type Subscribers = Map<string, Set<string>> | null;

export class ReactiveClass{

    static readonly stateChangeEffectSubscribers = new Map<string, Set<string>>;
    static readonly stateChangeComputedSubscribers = new Map<string, Set<string>>;
    static instances = 0;

    constructor(){
        ReactiveClass.instances++;
    }

    static addStateChangeEffectSubscribers(dependencies:string[], context:ClassMethodDecoratorContext){
        if(ReactiveClass.instances>1) return;
        dependencies.forEach(dependency=>{
            let subscriber = ReactiveClass.stateChangeEffectSubscribers.get(dependency);
            if(!subscriber){
                subscriber = new Set();
                ReactiveClass.stateChangeEffectSubscribers.set(dependency, subscriber);
            }
            subscriber.add(context.name as string);
        });
    }

    static addStateChangeComputedSubscribers(dependencies:string[], context:ClassMethodDecoratorContext){
        if(ReactiveClass.instances>1) return;
        dependencies.forEach(dependency=>{
            let subscriber = ReactiveClass.stateChangeComputedSubscribers.get(dependency);
            if(!subscriber){
                subscriber = new Set();
                ReactiveClass.stateChangeComputedSubscribers.set(dependency, subscriber);
            }
            subscriber.add(context.name as string);
        });
    }


    static runStateChangeEffectSubscribers(context:any, path:string){
        const subscribers = ReactiveClass.stateChangeEffectSubscribers.get(path);
        subscribers?.forEach((effectFnName:string)=>{
            context[effectFnName].call(context);
        });
    }

    static runStateChangeComputedSubscribers(context:any, path:string){
        const subscribers = ReactiveClass.stateChangeComputedSubscribers.get(path);
        subscribers?.forEach((effectFnName:string)=>{
            context[effectFnName].call(context);
        });
    }

    static runSubscribers(){
        
    }
};