import { Proxify } from "@beautiful-eyes/lib";
import { ReactiveClass } from "../reactiveClass/reactiveClass";
import { TaskQueue } from "@beautiful-eyes/lib/src/taskQueue/taskQueue";

const taskQueue = new TaskQueue();

function runStateChangeSubscribers<This extends ReactiveClass>(this:This){
    // taskQueue.push({
    //     cb: this.runSubscribers,
    //     context:this,
    // });
    this.runSubscribers();
}

export function State(){
    return function State<This extends ReactiveClass, V>(target: undefined, ctx: ClassFieldDecoratorContext<This, V>) {
        ctx.addInitializer(function(this:This){
            let value = (this as any)[ctx.name];
            // defining accessors
            Object.defineProperty(this, ctx.name, {
                get(){
                    return value;
                },
                set(val:any){
                    value = val;
                    runStateChangeSubscribers.call(this);
                    return true;
                }
            });
        });

        return function (this:This, val: V) :V{
            let t = this;
            return Proxify.get(val, ctx.name as string, this, null, function(this:This, path:string){
                runStateChangeSubscribers.call(t);
            }) as any;
        };
    };
}