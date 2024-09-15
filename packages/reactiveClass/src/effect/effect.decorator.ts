import { ReactiveClass } from "../reactiveClass/reactiveClass";

export function Effect(dependencies:string[]){
    return function<This extends ReactiveClass,V extends Array<any>,R>(target:(this:This, ...args:any[])=>R, context:ClassMethodDecoratorContext){
        context.addInitializer(function(this:This){
            this.addEffectSubscribers(dependencies, context);
        } as any);
        return function(this:This,...args:V):R{
            return target.call(this, ...args);
        }
    }
}