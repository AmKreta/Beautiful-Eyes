import { htmlObj } from "@beautiful-eyes/lib/types/types"

export default function loadTemplate(template:htmlObj | string){
    return (template as any).default;
}