export type Interpolation = Function;
export type AttributeValue = string | Interpolation;
export type AttributeObj = Record<string, AttributeValue>
export type EventHandlerObject = Record<string, Interpolation>;
export type RefObject = string;
export type IfElse = [Interpolation, HtmlObj[]];
export type NodeChild = string| HtmlObj | Interpolation | IfElse;
export type NodeChildren = NodeChild[];

export enum NODE_OBJ_TYPE {
    HTML_ELEMENT,
    DIRECTIVE
};

export type HtmlObj = {
    type: NODE_OBJ_TYPE.HTML_ELEMENT
    name:string, 
    attributes:AttributeObj,
    eventHandlers:EventHandlerObject,
    ref:RefObject,
    children:NodeChildren
};

export type DirectiveObj = {
    type: NODE_OBJ_TYPE.DIRECTIVE,
    name: string,
    children:[Interpolation, NodeChildren][]
}

export type Node = HtmlObj | DirectiveObj;

export type DependencyFn = (ctx:any) => any[];