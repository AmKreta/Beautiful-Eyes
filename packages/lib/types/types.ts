export type Interpolation = Function;
export type AttributeValue = string | Interpolation;
export type AttributeObj = Record<string, AttributeValue>
export type EventHandlerObject = Record<string, Interpolation>;
export type RefObject = string;
export type IfElse = [Interpolation, HtmlObj[]];

export type HtmlObj = {
    tagName:string, 
    attributes:AttributeObj,
    eventHandlers:EventHandlerObject,
    ref:RefObject,
    children:(string| HtmlObj | Interpolation | IfElse)[]
};

export type DependencyFn = (ctx:any) => any[];