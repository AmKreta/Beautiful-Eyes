import * as t from '@babel/types';

// receives jsxExpressionContainer.expression
export default function parseJSXExpression(expression:t.Expression | t.JSXEmptyExpression){
   if(t.isJSXEmptyExpression(expression)){
    return t.nullLiteral();
   }

   if(t.isJSXElement(expression)){
    // todo
    return t.nullLiteral();
   }

   // if expression is number, string, array, object, t.nullLiteral()
   if(
        t.isStringLiteral(expression) || 
        t.isNumericLiteral(expression) || 
        t.isArrayExpression(expression) || 
        t.isObjectExpression(expression) || 
        t.isNullLiteral(expression)
    ){
        return expression;
   }

   if(t.isIdentifier(expression)){
    if(expression.name==='undefined'){
        return t.nullLiteral();
    }
    else{
        // dependency todo
        return t.nullLiteral();
    }
   }

   // dependency in all other cases todo
   return t.nullLiteral();
}