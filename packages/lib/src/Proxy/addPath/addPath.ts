import { PROXY_OBJECT_KEYS } from "../proxyObjectKeys/proxyObjectKeys";

export function addPath(obj:any, path:string){
    Object.defineProperty(obj, PROXY_OBJECT_KEYS.path, {
        value: path,
        enumerable: false,
        writable: true,
    });
}