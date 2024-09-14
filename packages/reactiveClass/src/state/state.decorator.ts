import { getClassFromPrototypeChain, Proxify } from "@beautiful-eyes/lib";
import { ReactiveClass } from "../reactiveClass/reactiveClass";

function runStateChangeEffectSubscribers(self:any, path:string){
    const rc:ReactiveClass = getClassFromPrototypeChain(self, ReactiveClass);
    (rc.constructor as any).runStateChangeEffectSubscribers(self, path);
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
                        cb:()=>runStateChangeEffectSubscribers(this, ctx.name as string),
                        args:{path:ctx.name as string}
                    })
                    return true;
                }
            });
        });

        return function (val: V) :V{
            return Proxify.get(val, ctx.name as string, null, (path:string)=>{
                // this function will be executed on idle callback from task queue
                runStateChangeEffectSubscribers(self, path);
            }) as any;
        };
    };
}