"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = addExportStatement;
const t = __importStar(require("@babel/types"));
/*
    receives an object expression and add export default
    eg  input   ->  {key:val}
        output  ->  const objName = {key:val};
                    export default objName;
*/
function addExportStatement(path, objName) {
    if (path.node.body.length === 0) {
        console.warn("returning an empty template");
    }
    if (path.node.body.length > 1) {
        throw ("a template can return only one element, consider enclosing your template in a fragment");
    }
    t.assertExpressionStatement(path.node.body[0]);
    const body = path.node.body[0];
    t.assertObjectExpression(body.expression);
    const objExpression = body.expression;
    // removing everything from program, making the file blank
    path.node.body = [];
    const varDeclaration = t.variableDeclaration('const', [
        t.variableDeclarator(t.identifier('template'), objExpression)
    ]);
    const exportDefault = t.exportDefaultDeclaration(t.identifier('template'));
    path.pushContainer('body', varDeclaration);
    path.pushContainer('body', exportDefault);
}
;
