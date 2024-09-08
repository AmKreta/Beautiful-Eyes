import * as ts from 'typescript';

function componentTransformer(context: ts.TransformationContext) {
    return (sourceFile:ts.SourceFile) =>{
        const visitor:ts.Visitor = (node: ts.Node): ts.VisitResult<any>=>{
            if(ts.isDecorator(node)){
                const expression = node.expression;
                if(ts.isCallExpression(expression) && ts.isIdentifier(expression.expression) && expression.expression.text === 'Component'){
                    const args = expression.arguments;
                    if(args.length > 0 && ts.isObjectLiteralExpression(args[0])){
                        const properties = args[0].properties;
                        properties.forEach((prop) => {
                            if (ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name)) {
                                const keyName = prop.name.text;
                                if (keyName === 'useTemplate' && ts.isStringLiteral(prop.initializer)) {
                                    const importCall = ts.factory.createCallExpression(
                                    ts.factory.createToken(ts.SyntaxKind.ImportKeyword) as any, undefined,[prop.initializer]);
                                    (prop.initializer as any) = importCall;
                                }
                                if (keyName === 'useStyleSheets' && ts.isArrayLiteralExpression(prop.initializer)) {
                                    const elements = prop.initializer.elements.map((el) => {
                                        if (ts.isStringLiteral(el)) {
                                            return ts.factory.createCallExpression(ts.factory.createToken(ts.SyntaxKind.ImportKeyword) as any,undefined,[el]);
                                        }
                                        return el;
                                    });
                                    (prop.initializer as any) = ts.factory.createArrayLiteralExpression(elements, false);
                                }
                            }
                        });
                    }
                }
            }
            return ts.visitEachChild(node, visitor, context);
        }
        return ts.visitNode(sourceFile, visitor);
    }
}
  

export default function transformer(program: ts.Program) :ts.TransformerFactory<ts.SourceFile>{
  return (context: ts.TransformationContext): ts.Transformer<any> => (sourceFile:ts.SourceFile) => componentTransformer(context)(sourceFile);
}
