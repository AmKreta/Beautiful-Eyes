import { astNode } from "../astNode/astNode";

export class HtmlAttribute extends astNode{
    constructor(
        private tagName:string,
        private tagValue: string,
        private isInterpolation:boolean = false
    ){
        super();
    }
}