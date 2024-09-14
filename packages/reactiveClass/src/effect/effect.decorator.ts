import { ReactiveClass } from "../reactiveClass/reactiveClass";
import { getClassFromPrototypeChain } from "@beautiful-eyes/lib";

export function Effect(dependencies:string[]){
    return function<T,V extends Array<any>,R>(target:(this:T, ...args:any[])=>R, context:ClassMethodDecoratorContext){
        context.addInitializer(function(this:any){
            const rc:ReactiveClass = getClassFromPrototypeChain(this, ReactiveClass);
            (rc.constructor as any).addStateChangeEffectSubscribers(dependencies, context);
        });
        return function(this:T,...args:V):R{
            return target.call(this, ...args);
        }
    }
}