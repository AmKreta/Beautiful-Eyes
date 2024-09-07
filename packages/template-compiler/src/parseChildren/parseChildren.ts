import { NodePath } from "@babel/core";
import * as t from '@babel/types';

export default function parseChildren(path: NodePath<t.JSXElement>){
    const children = path.node.children.map((child) => {
        if (t.isJSXText(child)) {
          // Handle text nodes
          return t.objectExpression([
            t.objectProperty(t.identifier('type'), t.stringLiteral('text_node')),
            t.objectProperty(
              t.identifier('children'),
              t.arrowFunctionExpression(
                [],
                t.templateLiteral(
                  [t.templateElement({ raw: child.value.trim() })],
                  []
                )
              )
            )
          ]);
        } else if (t.isJSXElement(child)) {
          // Recursively process child JSX elements
          return t.callExpression(t.identifier('processJSXElement'), [child]);
        }
      });
    return children;
}