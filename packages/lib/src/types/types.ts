export class Types{
    
    private static stringConv(obj:any) : string{
        return Object.prototype.toString.call(obj);
    }

    static isNumber(obj:any) : obj is number{
        return typeof obj === 'number';
    }

    static isString(obj:any) : obj is string{
        return typeof obj ==='string';
    }

    static isObject<T = any>(obj:any) : obj is T{
        return Types.stringConv(obj) === '[object Object]';
    }

    static isArray<T = any>(obj: any) : obj is Array<T>{
        return Types.stringConv(obj) === '[object Array]';
    }

    static isMap<Key = any, Val = any>(obj:any) : obj is Map<Key, Val>{
        return Types.stringConv(obj) === '[object Map]';
    }

    static isSet<T = any>(obj:any) : obj is Set<T>{
        return Types.stringConv(obj) === '[object Set]';
    }   

    static isDate(obj:any) : obj is Date{
        return Types.stringConv(obj) === '[object Date]';
    }
};