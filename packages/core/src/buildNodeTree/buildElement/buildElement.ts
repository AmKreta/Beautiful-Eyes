import { IHtmlObj } from "@beautiful-eyes/lib";
import buildNodeTree from "../buildNodeTree";

export default function buildElement(htmlObj:IHtmlObj){
    const element = document.createElement(htmlObj.kind as string);
    if(htmlObj.props){
        for(let propName in htmlObj.props){
            if(propName.startsWith('On')){
                
            }
            else{
                element.setAttribute(propName, (htmlObj.props as any)[propName] as string);
            }
        }
    }
    if(htmlObj.children){
       (htmlObj.children as IHtmlObj[]).forEach(child=>{
        element.appendChild(buildNodeTree(child) as any);
       });
    }
    return element;
}