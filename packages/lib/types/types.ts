type AttributeObj = Record<string, string | Function>
type EventHandlerObject = Record<string, string | Function>;
type RefObject = string;

export type HtmlObj = {
    tagName:string, 
    attributes:AttributeObj,
    eventHandlers:EventHandlerObject,
    ref:RefObject,
    children:(string| HtmlObj | Function)[]
};

export type DependencyFn = (ctx:any) => any[];