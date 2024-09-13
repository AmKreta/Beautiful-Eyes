import { Proxify } from "@beautiful-eyes/lib";

function runStateChangeEffectSubscribers(self:any, path:string){
    const effectsubscribers = self.__proto__.stateChageEffectSubscribers.get(path);
    effectsubscribers?.forEach((effectFnName:string)=>{
        self[effectFnName].call(self);
    });
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
                    runStateChangeEffectSubscribers(this, ctx.name as string);
                    return true;
                }
            });
        });

        return function (val: V) :V{
            return Proxify.get(val, ctx.name as string, null, (path:string)=>{
                runStateChangeEffectSubscribers(self, path);
            }) as any;
        };
    };
}