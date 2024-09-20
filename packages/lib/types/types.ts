export type htmlObj = {
    tagName:string, 
    attributes:Record<string, string>, 
    children:(string|htmlObj)[]
};

export type DependencyFn = (ctx:any) => any[];