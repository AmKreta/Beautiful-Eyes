import { NodePath } from "@babel/core";
import * as t from '@babel/types';
import parseAttributes from "../parseAttributes/parseParams.component";
import parseChildren from "../parseChildren/parseChildren";

export default function parseJSXElement(path: NodePath<t.JSXElement>){
    const openingElement = path.node.openingElement;
    const elementName = (openingElement.name as t.JSXIdentifier).name;
    const attributes = openingElement.attributes;

    const props: t.ObjectProperty[] = parseAttributes(attributes);
    const children:any[] = parseChildren(path);

    // properties of a transpiled node
    const nodeProperties = [
      t.objectProperty(t.identifier('type'), t.stringLiteral('element')),
      t.objectProperty(t.identifier('kind'), t.stringLiteral(elementName)),
    ];

    if(props.length){
      nodeProperties.push( t.objectProperty(t.identifier('props'), t.objectExpression(props)));
    }

    if(children.length){
      nodeProperties.push(  t.objectProperty(t.identifier('children'), t.arrayExpression(children)));
    }

    path.replaceWith(t.objectExpression(nodeProperties));
}