import { Proxify } from "@beautiful-eyes/lib";

export function State(){
    return function State<This, V>(target: undefined, ctx: ClassFieldDecoratorContext<This, V>) {
        ctx.addInitializer(function(this:This){
            let value = (this as any)[ctx.name];

            // defining accessors
            Object.defineProperty(this, ctx.name, {
                get(){
                    return value;
                },
                set(val:any){
                    value = val;
                    const effectsubscribers = this.__proto__.stateChageEffectSubscribers.get(ctx.name);
                    effectsubscribers?.forEach((effectFnName:string)=>{
                        this[effectFnName].call(this);
                    });
                    return true;
                }
            });
        });

        return function (val: V) :V{
            return Proxify.get(val, ctx.name as string, null, ()=>{
                console.log('something updated')
            }) as any;
        };
    };
}