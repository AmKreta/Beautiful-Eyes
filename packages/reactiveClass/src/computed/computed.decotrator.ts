import { ReactiveClass } from "../reactiveClass/reactiveClass";

export function Computed(dependencies:string[]){
    return function<This extends ReactiveClass, Return>(target: (this: This) => Return, context: ClassGetterDecoratorContext<This, Return>){
        context.addInitializer(function(this:This){
            this.addComputedSubscribers(dependencies, context);
        });
        return function (this: This): Return {
            const value = target.call(this);
            return value;
        };
    }
}