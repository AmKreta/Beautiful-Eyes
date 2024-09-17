import { DependencyFn } from "@beautiful-eyes/lib";
import { ReactiveClass } from "../reactiveClass/reactiveClass";

export function Effect(dependencyFn:DependencyFn){
    return function<This extends ReactiveClass,V extends Array<any>,R>(target:(this:This, ...args:any[])=>R, context:ClassMethodDecoratorContext){
        context.addInitializer(function(this:This){
            this.addEffectSubscribers(dependencyFn, context);
        } as any);
        return function(this:This,...args:V):R{
            return target.call(this, ...args);
        }
    }
}