import { ReactiveClass } from "../reactiveClass/reactiveClass";
import { getClassFromPrototypeChain } from "@beautiful-eyes/lib";

export function Computed(dependencies:string[]){
    return function<This, Return>(target: (this: This) => Return, context: ClassGetterDecoratorContext<This, Return>){
        context.addInitializer(function(this:any){
            const rc:ReactiveClass = getClassFromPrototypeChain(this, ReactiveClass) as ReactiveClass;
            (rc.constructor as any).addComputedSubscribers(dependencies, context);
        });
        return function (this: This): Return {
            const value = target.call(this);
            return value;
        };
    }
}