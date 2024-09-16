import { addParent } from "../addParent/addParent";
import {updateParent} from "../updateParent/updateParent";
import { addPath } from "../addPath/addPath";
import { PROXY_OBJECT_KEYS } from "../proxyObjectKeys/proxyObjectKeys";
import { Types } from "../../types/types";
import {TaskQueue, MutationCallback} from "../taskQueue/taskQueue";

export class Proxify{
    public static readonly taskQueue = new TaskQueue();
    
    private static proxyHandler:ProxyHandler<any> | null = null;

    private static getProxyHandler(contextObj:any, cb?:MutationCallback):ProxyHandler<any>{
        return  {
            get(target, prop, receiver){
                const res = Reflect.get(target, prop, receiver);
                Proxify.updatePathKeys(res, target, prop);
                return res;
            },
            set(target, prop, value, receiver){ 
                const res = Reflect.set(target, prop, value, receiver);
                Proxify.updatePathKeys(res, target, prop);
                if(prop !== PROXY_OBJECT_KEYS.path && prop!==PROXY_OBJECT_KEYS.parent && cb){
                    Proxify.taskQueue.push({
                        cb,
                        context: contextObj,
                        args:{path: target[PROXY_OBJECT_KEYS.path]+`.${String(prop)}`}
                    });
                }
                return res;
            },
            deleteProperty(target, prop){
                const res = Reflect.deleteProperty(target, prop);
                Proxify.taskQueue.push({
                    cb:cb!,
                    context: contextObj,
                    args:{path: target[PROXY_OBJECT_KEYS.path]+`.${String(prop)}`}
                });
                return res;
            }
        } as const;
    }

    static updatePathKeys(obj:any, target:any, path:string | symbol){
        if(Types.isArray(obj) || Types.isObject(obj) || Types.isMap(obj) || Types.isSet(obj)){
            obj[PROXY_OBJECT_KEYS.path] = target[PROXY_OBJECT_KEYS.path]+`.${String(path)}`;
        }
    }

    static makeProxy(obj:any):{subscription:any, [key:string]:any}{
        if(!Proxify.proxyHandler){
            throw new Error('proxyhandler not defined while trying to proxify an object');
        }
        return new Proxy(obj,  Proxify.proxyHandler);
    }

    private static proxifyArray(arr:any[]){
        const proxy = Proxify.makeProxy(arr);
        for(let i = 0; i<arr.length; i++){
            if(Types.isArray(arr[i])){
                updateParent(arr[i], arr);
                arr[i] = Proxify.proxifyArray(arr[i]);
            }
            else if(Types.isObject(arr[i])){
                updateParent(arr[i], arr);
                arr[i] = Proxify.proxifyObject(arr[i]);
            }
            else if(Types.isMap(arr[i]))
                arr[i] =  Proxify.proxifyMap(arr[i]);
            else if(Types.isSet(arr[i]))
                arr[i] =  Proxify.proxifySet(arr[i]);
        }
        return proxy;
    }
    
    private static proxifyObject(obj:Record<any, any>){
        const proxy = Proxify.makeProxy(obj);
        for(let key in obj){
            if(key===PROXY_OBJECT_KEYS.parent as any){
                continue;
            }
            if(Types.isArray(obj[key])){
                updateParent(obj[key], obj);
                obj[key] =  Proxify.proxifyArray(obj[key]);
            }
            else if(Types.isObject(obj[key])){
                updateParent(obj[key], obj);
                obj[key] =  Proxify.proxifyObject(obj[key]);
            }
            else if(Types.isMap(obj[key]))
                obj[key] =  Proxify.proxifyMap(obj[key]);
            else if(Types.isSet(obj[key]))
                obj[key] =  Proxify.proxifySet(obj[key]);
        }
        return proxy;
    }
    
    private static proxifyMap(map:Map<any, any>){
        for(let [key, val] of map.entries()){
            if(Types.isArray(val))
                map.set(key,  Proxify.proxifyArray(val));
            else if(Types.isObject(val))
                map.set(key,  Proxify.proxifyObject(val));
            else if(Types.isMap(val))
                map.set(key,  Proxify.proxifyMap(val));
            else if(Types.isSet(val))
                map.set(key,  Proxify.proxifySet(val));
        }
        return  Proxify.makeProxy(map);
    }
    
    private static proxifySet(set:any){
        return  Proxify.makeProxy(set);
    }
    
    static get(obj:any, stateName:string, contextObj: any, parent:object|null = null, cb?:MutationCallback) : typeof obj{
        if(!obj) return obj; // empty string, 0, null undefined etc;
        if(Types.isNumber(obj) || Types.isString(obj)) return obj;

        // adding parent to the object
        addParent(obj, parent);

        // adding path to root object, 
        // path of nested obj will be determined at runtime while accessing them in get trap
        !parent && addPath(obj, stateName);

        // setting proxy handler before proxifying
        Proxify.proxyHandler = Proxify.getProxyHandler(contextObj, cb);
        if(Types.isArray(obj)) return  Proxify.proxifyArray(obj);
        if(Types.isObject(obj)) return  Proxify.proxifyObject(obj);
        if(Types.isMap(obj)) return  Proxify.proxifyMap(obj);
        if(Types.isSet(obj)) return  Proxify.proxifySet(obj);
        Proxify.proxyHandler = null;
        throw new Error("only Array, Object, Map and Set can be Proxified");
    }
};