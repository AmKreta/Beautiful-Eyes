import { IHtmlObj, NODE_TYPE } from "@beautiful-eyes/lib";
import buildElement from "./buildElement/buildElement";

function buildComponent(){

}

function buildFragment(){

}

export default function buildNodeTree(htmlObj:IHtmlObj){
    let el;
    if(htmlObj.type === NODE_TYPE.ELEMENT){
        el = buildElement(htmlObj);
    }

    if(htmlObj.type === NODE_TYPE.TEXT_NODE){
        el = document.createTextNode(htmlObj.children as string);
    }

    return el;
}