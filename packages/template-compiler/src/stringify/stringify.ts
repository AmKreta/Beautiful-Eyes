import { htmlObj } from "@beautiful-eyes/lib/types/types"

export default function stringify(nodes:htmlObj[]){
    let res = '';
    for(let node of nodes){
        res+=`{tag:"${node.tagName}", attributes:{`;
        for(let key in node.attributes){
            res+=`${key}:`;
            let val = node.attributes[key];
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
            res+=stringify(child as any);
           }
        }
        res+="]}";
    }
    return res;
}