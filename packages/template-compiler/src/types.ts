export type htmlObj = {
    tagName:string, 
    attributes:Record<string, string>, 
    children:(string|htmlObj)[]
};