
export default function bootstrap(el:HTMLElement, rootNode:any){
   const roots = rootNode.init();
   const frag = document.createDocumentFragment();
   roots.forEach((el:HTMLElement)=>frag.appendChild(el));
   el.appendChild(frag);
}