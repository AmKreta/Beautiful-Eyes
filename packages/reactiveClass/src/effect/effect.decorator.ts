function addStateChangeSubscriberToPrototype(this:any){
    if(this.constructor.prototype.stateChageEffectSubscribers){
        return;
    }
    Object.defineProperty(this.constructor.prototype,'stateChageEffectSubscribers',{
        enumerable:false,
        value:new Map() // {stateName => [effectNames]}
    });
}

export function Effect(dependencies:string[]){
    return function<T,V extends Array<any>,R>(target:(this:T, ...args:any[])=>R, context:ClassMethodDecoratorContext){
        context.addInitializer(function(this:any){
            addStateChangeSubscriberToPrototype.call(this);
            dependencies.forEach(dependency=>{
                let subscriber = this.stateChageEffectSubscribers.get(dependency);
                if(!subscriber){
                    subscriber = new Set();
                    this.stateChageEffectSubscribers.set(dependency, subscriber);
                }
                subscriber.add(context.name);
            });
        });

        return function(this:T,...args:V):R{
            return target.call(this, ...args);
        }
    }
}