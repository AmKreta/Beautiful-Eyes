export type Subscribers = Map<string, Set<string>> | null;

// effectSubscribers: dependency: state | computed -> effect
// computedSubscribers: dependency: stte | computed -> computed
// computed can't change without changing states
// hence no need to do anything when computed change
// when state change, determine what path of state was changes, and which computed were affected, store them in paths
// run loop on paths, run effectSubscribers for each path

export class ReactiveClass{

    static readonly effectSubscribers = new Map<string, Set<string>>;
    static readonly computedSubscribers = new Map<string, Set<string>>;

    static instances = 0;

    constructor(){
        ReactiveClass.instances++;
    }

    // dependency: state | computed -> [effectNames]
    static addEffectSubscribers(dependencies:string[], context:ClassMethodDecoratorContext){
        if(ReactiveClass.instances>1) return;
        dependencies.forEach(dependency=>{
            let subscriber = ReactiveClass.effectSubscribers.get(dependency);
            if(!subscriber){
                subscriber = new Set();
                ReactiveClass.effectSubscribers.set(dependency, subscriber);
            }
            subscriber.add(context.name as string);
        });
    }

    // dependency state | computed -> [effectNames]
    static addComputedSubscribers(dependencies:string[], context:ClassMethodDecoratorContext){
        if(ReactiveClass.instances>1) return;
        dependencies.forEach(dependency=>{
            let subscriber = ReactiveClass.computedSubscribers.get(dependency);
            if(!subscriber){
                subscriber = new Set();
                ReactiveClass.computedSubscribers.set(dependency, subscriber);
            }
            subscriber.add(context.name as string);
        });
    }


    static runEffectSubscribers(context:any, paths:string[], batchedEffects:Set<string>){
        // runs effects when state changes
        for(let path of paths){
            const subscribers = ReactiveClass.effectSubscribers.get(path);
            subscribers?.forEach((effectFnName:string)=>{
                batchedEffects.add(effectFnName);
            });
        }
    }

    static runComputedSubscribers(path:string){
        // determines which effect dependent on which path should run if a state is changed
        const paths:string[] = [path];
        const subscribers = ReactiveClass.computedSubscribers.get(path);
        subscribers && paths.push(...subscribers);
        return paths;
    }

    static runSubscribers(context:any, path:string){
        const batchedEffects = new Set<string>();
        // determine which computed were affected and which effects were dependent on them
        const paths = ReactiveClass.runComputedSubscribers(path);
        // batching effects based on determined path
        ReactiveClass.runEffectSubscribers(context, paths, batchedEffects);
        // running subscribers
        batchedEffects.forEach(effectFnName=>{
            context[effectFnName].call(context);
        })
    }
};