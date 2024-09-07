import * as t from '@babel/types';

function parseAttributeValue(val:t.JSXElement | t.JSXFragment | t.StringLiteral | t.JSXExpressionContainer | null | undefined){
    if(!val){
        return `${val}`;
    }

    if(t.isJSXExpressionContainer(val)){
      // do nothing
      return val.expression;
    }

    if(t.isJSXElement(val)){
      throw new Error("cannot assign jsx element directly to a prop, consider wrappiong expression in {}");
    }

    if(t.isJSXFragment(val)){
      throw new Error("cannot assign jsx fragment directly to a prop, consider wrappiong expression in {}");
    }

    if(t.isStringLiteral(val)){
        return val.value;
    }

    throw new Error("while parsing attribute value, expected | t.StringLiteral | t.JSXExpressionContainer | null | undefined got "+ (val as any).type);
}

export default function parseAttributes(attributes:(t.JSXAttribute | t.JSXSpreadAttribute)[]){
     // Initialize `props` and `eventHandlers`
     const props: t.ObjectProperty[] = [];
     
      attributes.forEach((attr) => {
        if (t.isJSXAttribute(attr)) {
          const attrName = attr.name.name;
          if(typeof attrName!=='string'){
            throw new Error("expected string as attribute name got "+attrName.type);
          }

          const attrValue = attr.value as any as t.StringLiteral;

          props.push(
            t.objectProperty(
              t.identifier(attrName),
              t.stringLiteral(attrValue.value)
            )
          );

      //   if (t.isJSXExpressionContainer(attrValue)) {
      //     props.push(
      //       t.objectProperty(
      //         t.identifier(attrName),
      //         t.arrowFunctionExpression([], attrValue.expression)
      //       )
      //     );
      //   } else if (t.isStringLiteral(attrValue)) {
      //     props.push(
      //       t.objectProperty(
      //         t.identifier(attrName),
      //         t.stringLiteral(attrValue.value)
      //       )
      //     );
      //   }
       }
    });
    return props;
}