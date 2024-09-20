type AttributeObj = Record<string, string | Function>

export type HtmlObj = {
    tagName:string, 
    attributes:AttributeObj, 
    children:(string|HtmlObj | Function)[]
};

export type DependencyFn = (ctx:any) => any[];