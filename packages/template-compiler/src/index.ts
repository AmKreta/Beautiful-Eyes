module.exports = function({ types: t }) {
    return {
      visitor: {
        JSXElement(path) {
          // Get the opening element and its attributes
          const openingElement = path.node.openingElement;
          const elementName = openingElement.name.name;
          const attributes = openingElement.attributes;
  
          // Initialize `props` and `eventHandlers`
          const props = [];
          const eventHandlers = [];
          
          attributes.forEach(attr => {
            const attrName = attr.name.name;
            const attrValue = attr.value;
  
            // Distinguish between event handlers and props
            if (attrName.startsWith('on')) {
              eventHandlers.push(
                t.objectProperty(
                  t.identifier(attrName),
                  attrValue.expression ? attrValue.expression : attrValue
                )
              );
            } else {
              props.push(
                t.objectProperty(
                  t.identifier(attrName),
                  // Handle JSX expressions and string literals
                  attrValue.expression 
                    ? t.arrowFunctionExpression([], attrValue.expression)
                    : attrValue.type === 'StringLiteral' 
                      ? t.numericLiteral(parseInt(attrValue.value, 10)) 
                      : attrValue
                )
              );
            }
          });
  
          // Handle the children of the JSX element
          const children = path.node.children.map(child => {
            if (t.isJSXText(child)) {
              // Handle text nodes
              return t.objectExpression([
                t.objectProperty(t.identifier('type'), t.stringLiteral('text_node')),
                t.objectProperty(t.identifier('children'), 
                  t.arrowFunctionExpression([], t.templateLiteral([
                    t.templateElement({ raw: child.value.trim() })
                  ], []))
                )
              ]);
            } else if (t.isJSXElement(child)) {
              // Recursively process child JSX elements
              return t.callExpression(t.identifier('processJSXElement'), [child]);
            }
          });
  
          // Replace JSXElement with the custom object format
          path.replaceWith(
            t.objectExpression([
              t.objectProperty(t.identifier('type'), t.stringLiteral('element')),
              t.objectProperty(t.identifier('kind'), t.stringLiteral(elementName)),
              t.objectProperty(t.identifier('props'), t.objectExpression(props)),
              t.objectProperty(t.identifier('eventHandlers'), t.objectExpression(eventHandlers)),
              t.objectProperty(t.identifier('children'), t.arrayExpression(children))
            ])
          );
        }
      }
    };
  };
  