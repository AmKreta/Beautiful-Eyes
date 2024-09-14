import { getClassFromPrototypeChain, Proxify } from "@beautiful-eyes/lib";
import { ReactiveClass } from "../reactiveClass/reactiveClass";

function runStateChangeSubscribers(this:any, path:string){
    const rc:ReactiveClass = getClassFromPrototypeChain(this, ReactiveClass);
    (rc.constructor as any).runSubscribers(this, path);
}

export function State(){
    return function State<This, V>(target: undefined, ctx: ClassFieldDecoratorContext<This, V>) {
        let self:This | null = null;
        ctx.addInitializer(function(this:This){
            self = this;
            let value = (this as any)[ctx.name];

            // defining accessors
            Object.defineProperty(this, ctx.name, {
                get(){
                    return value;
                },
                set(val:any){
                    value = val;
                    Proxify.taskQueue.push({
                        context: this, 
                        cb:runStateChangeSubscribers.bind(this, ctx.name as string),
                        args:{path:ctx.name as string}
                    })
                    return true;
                }
            });
        });

        return function (this:This, val: V) :V{
            return Proxify.get(val, ctx.name as string, this, null, function(this:This, path:string){
                // this function will be executed on idle callback from task queue
                runStateChangeSubscribers.call(this, path);
            }) as any;
        };
    };
}