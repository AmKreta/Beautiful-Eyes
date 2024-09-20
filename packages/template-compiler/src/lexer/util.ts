export function isValidAttributeName(text:string){
    return (/^($|#|@)?[a-zA-Z]{1}[a-zA-Z0-9_-]*/).test(text)
}

export function isValidTagName(text:string){
    return (/^[a-zA-Z][a-zA-Z0-9_]*$/).test(text);
}

export function isText(text:string){
    return (/[a-zA-Z]/).test(text)
}

export function isNum(text:string){
    return (/[0-9]/).test(text)
}

export function isTextOrNum(text:string){
    return isText(text) || isNum(text);
}

export function isTextOrNumOrInterpolation(text:string){
    return isTextOrNum(text) || (/[{]/).test(text);
}

export function getDelimeterForAttributes(text:string){
    switch(text){
        case '"': 
        case "'":
        case "`": return text;
        case '{': return '}';
        default: return '<'; // for plain simple text , either closing or opening tag wil be the delimeter
    }
}
