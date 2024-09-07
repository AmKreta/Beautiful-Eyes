import { NodePath } from '@babel/core';
import * as t from '@babel/types';

/*
    receives an object expression and add export default
    eg  input   ->  {key:val}
        output  ->  const objName = {key:val}; 
                    export default objName;
*/

export default function addExportStatement(path:NodePath<t.Program>, objName:string){
    if(path.node.body.length===0){
        console.warn("returning an empty template");
    }
    if(path.node.body.length>1){
        throw("a template can return only one element, consider enclosing your template in a fragment");
    }
    t.assertExpressionStatement(path.node.body[0]);
    const body:t.ExpressionStatement = path.node.body[0];
    t.assertObjectExpression(body.expression);
    const objExpression:t.ObjectExpression = body.expression;

    // removing everything from program, making the file blank
    path.node.body = [];

    const varDeclaration = t.variableDeclaration('const', [
    t.variableDeclarator(t.identifier('template'), objExpression)
    ]);
    const exportDefault = t.exportDefaultDeclaration(t.identifier('template'));
    path.pushContainer('body', varDeclaration);
    path.pushContainer('body', exportDefault);
};