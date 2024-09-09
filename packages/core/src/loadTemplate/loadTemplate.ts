import { IHtmlObj } from "@beautiful-eyes/lib";

export default function loadTemplate(template:IHtmlObj | string) : Promise<IHtmlObj>{
    return new Promise(async function(resolve){
        const t:any = await Promise.resolve(template);
        if(t.__esModule){
            resolve(t.default);
        }
        else{
            resolve(t);
        }
    });
}