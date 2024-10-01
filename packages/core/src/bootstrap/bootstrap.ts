import { IComponent } from "../component/component.decorator";

export default function bootstrap(el:HTMLElement, rootNode:IComponent | any){
   rootNode.serParent(el);
   const roots = rootNode.view.root;
   const frag = document.createDocumentFragment();
   roots.forEach((el:HTMLElement)=>frag.appendChild(el));
   el.appendChild(frag);
}