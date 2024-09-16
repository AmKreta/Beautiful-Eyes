import { PROXY_OBJECT_KEYS } from "../proxyObjectKeys/proxyObjectKeys";

export function addParent(obj:any, parent:any = null){
    Object.defineProperty(obj, PROXY_OBJECT_KEYS.parent, {
        value: parent,
        writable: true, 
        enumerable: false,
        configurable:false
    });
}