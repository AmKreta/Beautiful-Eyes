import { HtmlObj } from "@beautiful-eyes/lib/types/types"

export default function stringify(nodes:HtmlObj[]){
    let res = '[';
    for(let node of nodes){
        res+=`{tagName:"${node.tagName}", attributes:{`;
        for(let key in node.attributes){
            res+=`${key}:`;
            let val = node.attributes[key] as string;
            if(val.startsWith('function(')) res+=val+',';
            else res+=`"${val}",`;
        }
        res+='}, children:[';
        for(let child of node.children){
           if(typeof child === 'string'){
            if(child.startsWith('function(')) res+=(child+',');
            else res+=`"${child}",`;
           }
           else{
            res+=stringify([child as any]);
           }
        }
        res+="], eventHandlers:{";
        for(let eventName in node.eventHandlers){
            let val = node.eventHandlers[eventName] as string;
            if(val.startsWith('function(')) res+=`${eventName} : ${val}, `;
            else throw new Error('event handler should be interpolation');
        }
        res+="}, ref:";
        if(node.ref) res+= node.ref;
        else res+='null';
        res+='}, '
    }
    res+=']';
    return res;
}