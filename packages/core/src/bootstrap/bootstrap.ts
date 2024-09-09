
export default function bootstrap(el:HTMLElement, rootNode:any){
   rootNode.init().then(()=>{
    el.appendChild(rootNode.nodeTree);
   });
}