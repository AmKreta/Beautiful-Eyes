import { NodePath } from "@babel/core";
import * as t from '@babel/types';

export default function parseChildren(path: NodePath<t.JSXElement>){
    const children:(t.JSXElement | t.ObjectExpression | undefined)[] =  [];
    for(let child of path.node.children){
      let prop:t.JSXElement | t.ObjectExpression | undefined = undefined;
      if (t.isJSXText(child)) {
        if(child.value.trim()){
          prop = t.objectExpression([
            t.objectProperty(t.identifier('type'), t.stringLiteral('text_node')),
            t.objectProperty(
              t.identifier('children'),
              t.stringLiteral(child.value.trim())
            )
          ]); 
        }
      } 
      else if (t.isJSXElement(child)) {
        prop = child;
      }
      if(prop){
        children.push(prop);
      }
    }
    return children;
}