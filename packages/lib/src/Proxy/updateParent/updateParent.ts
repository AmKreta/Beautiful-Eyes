import { PROXY_OBJECT_KEYS } from "../proxyObjectKeys/proxyObjectKeys";

export function updateParent(obj:any, parent:any){
   obj[PROXY_OBJECT_KEYS.parent] = parent;
}