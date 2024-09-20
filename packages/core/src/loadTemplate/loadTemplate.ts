import { HtmlObj } from "@beautiful-eyes/lib/types/types"

export default function loadTemplate(template:HtmlObj | string){
    return (template as any).default;
}