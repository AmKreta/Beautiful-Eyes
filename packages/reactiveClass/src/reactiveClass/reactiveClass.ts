import { BatchedUpdates } from "@beautiful-eyes/lib/src/Proxy/taskQueue/taskQueue";

export type Subscribers = Map<string, Set<string>> | null;

// effectSubscribers: dependency: state | computed -> effect
// computedSubscribers: dependency: stte | computed -> computed
// computed can't change without changing states
// hence no need to do anything when computed change
// when state change, determine what path of state was changes, and which computed were affected, store them in paths
// run loop on paths, run effectSubscribers for each path

export class ReactiveClass implements BatchedUpdates{

    static readonly effectSubscribers = new Map<string, Set<string>>;
    static readonly computedSubscribers = new Map<string, Set<string>>;
    batchedEffects:Set<string> | null = null;

    static instances = 0;

    constructor(){
        ReactiveClass.instances++;
    }

    // dependency: state | computed -> [effectNames]
    addEffectSubscribers(dependencies:string[], context:ClassMethodDecoratorContext){
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
    addComputedSubscribers(dependencies:string[], context:ClassGetterDecoratorContext){
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


    batchEffectSubscribers(paths:string[]){
        if(!this.batchedEffects){
            this.batchedEffects = new Set<string>();
        }
        // runs effects when state changes
        for(let path of paths){
            const subscribers = ReactiveClass.effectSubscribers.get(path);
            subscribers?.forEach((effectFnName:string)=>{
                this.batchedEffects!.add(effectFnName);
            });
        }
    }

    runComputedSubscribers(path:string){
        // determines which effect dependent on which path should run if a state is changed
        const paths:string[] = [path];
        const subscribers = ReactiveClass.computedSubscribers.get(path);
        subscribers && paths.push(...subscribers);
        return paths;
    }

    runSubscribers(path:string){
        // determine which computed were affected and which effects were dependent on them
        const paths = this.runComputedSubscribers(path);
        // batching effects based on determined path
        this.batchEffectSubscribers(paths);
    }

    comitBatchedItems(){
        // running subscribers
        if(!this.batchedEffects) return;
        this.batchedEffects.forEach(effectFnName=>{
            (this as any)[effectFnName]?.call(this);
        });
        this.batchedEffects = null;
    }
};