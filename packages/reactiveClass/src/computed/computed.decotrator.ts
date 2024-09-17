import { ReactiveClass } from "../reactiveClass/reactiveClass";

export function Computed(){
    return function<This extends ReactiveClass, Return>(target: (this: This) => Return, context: ClassGetterDecoratorContext<This, Return>){
        return function (this: This): Return {
            const value = target.call(this);
            return value;
        };
    }
}