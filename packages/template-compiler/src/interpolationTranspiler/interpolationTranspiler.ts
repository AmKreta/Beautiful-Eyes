// adds this. in vard in an interpolation

export default function interpolationTranspiler(str:string){
    let i=0;

    function skipSkippable(){
        while(i<str.length && [' ', '\n', '\t'].includes(str[i])){
            i++;
        }
    }
  
    function transpileInterpolation(isInterpolation = false){
        let res = '';
        while(i<str.length){
            skipSkippable();
            if(['"',"'"].includes(str[i])){
                res+=readString();
            }
            else if(str[i]==='`'){
                res+=readInterpolation();
            }
            else if(/^[a-zA-Z_]$/.test(str[i])){
                res+=readVar();
            }
            else if(str[i]=='}' && isInterpolation){
                // interpolation recursion
                return res;
            }
            else{
                res+=str[i++];
            }
        }
        return res;
    }

    function readString(){
        let delimeter = str[i]=='"' ? '"' : "'";
        let res = str[i++];
        while(str[i]!=delimeter && i<str.length){
            res+=str[i++];
        }
        if(str[i]!==delimeter){
            throw new Error("unterminated string");
        }
        res+=delimeter;
        i++;
        return res;
    }

    function readVar(){
        if(!(/^[a-zA-Z_]/.test(str[0]))){
            throw new Error(`variable name cannot start with ${str[0]}`);
        }
        let res = '';
        while(i<str.length && (/^[a-zA-Z_$]$/.test(str[i]))){
            res+=str[i++];
        }
        res = `this.${res}`;
        return res;
    }

    function readInterpolation(){
        if(str[i]!=="`"){
            throw new Error(`expected  got ${str[i]}`);
        }
        let res = str[i++];
        while(str[i]!="`" && i<str.length){
            if(str[i]=='$' && str[i+1]=='{'){
                res+='${';
                i+=2;
                res+= transpileInterpolation(true);
                res+='}';
            }
            else{
                res+=str[i++];
            }
        }
        if(str[i]!='`'){
             throw new Error("unterminated string");
        }
        res+=str[i++];
        return res;
    }
    
    return transpileInterpolation();
}