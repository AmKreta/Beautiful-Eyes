export function getClassFromPrototypeChain(obj:any, parentClass:any){
    if(!parentClass.constructor){
        throw new Error("parentClass should be a class");
    }
    if(!obj.__proto__.constructor){
        throw new Error("obj should be an instance of a class");
    }
    if(!(obj instanceof parentClass)){
        throw new Error("obj should be inherited from parentClass");
    }
    let proto:any = obj;
    while (proto && proto instanceof parentClass) {
        proto = (proto as any).__proto__;
    }
    return proto;
}