import buildElement from "./buildElement/buildElement";
import { htmlObj } from "@beautiful-eyes/lib/types/types"

function buildComponent(){

}

function buildFragment(){

}

export default function buildNodeTree(htmlObj:htmlObj){
    let el;
    if(/^[a-z]/.test(htmlObj.tagName[0])){
        el = buildElement(htmlObj);
    }

    return el;
}