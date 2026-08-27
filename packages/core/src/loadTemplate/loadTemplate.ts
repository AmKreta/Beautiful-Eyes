import { HtmlObj } from "@beautiful-eyes/lib"

export default function loadTemplate(template:HtmlObj | string){
    return (template as any).default;
}