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
exports.default = parseChildren;
const t = __importStar(require("@babel/types"));
function parseChildren(path) {
    const children = [];
    for (let child of path.node.children) {
        let prop = undefined;
        if (t.isJSXText(child)) {
            if (child.value.trim()) {
                prop = t.objectExpression([
                    t.objectProperty(t.identifier('type'), t.stringLiteral('text_node')),
                    t.objectProperty(t.identifier('children'), t.stringLiteral(child.value.trim()))
                ]);
            }
        }
        else if (t.isJSXElement(child)) {
            prop = child;
        }
        if (prop) {
            children.push(prop);
        }
    }
    return children;
}
