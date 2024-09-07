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
exports.default = parseAttributes;
const t = __importStar(require("@babel/types"));
function parseAttributeValue(val) {
    if (!val) {
        return `${val}`;
    }
    if (t.isJSXExpressionContainer(val)) {
        // do nothing
        return val.expression;
    }
    if (t.isJSXElement(val)) {
        throw new Error("cannot assign jsx element directly to a prop, consider wrappiong expression in {}");
    }
    if (t.isJSXFragment(val)) {
        throw new Error("cannot assign jsx fragment directly to a prop, consider wrappiong expression in {}");
    }
    if (t.isStringLiteral(val)) {
        return val.value;
    }
    throw new Error("while parsing attribute value, expected | t.StringLiteral | t.JSXExpressionContainer | null | undefined got " + val.type);
}
function parseAttributes(attributes) {
    // Initialize `props` and `eventHandlers`
    const props = [];
    attributes.forEach((attr) => {
        if (t.isJSXAttribute(attr)) {
            const attrName = attr.name.name;
            if (typeof attrName !== 'string') {
                throw new Error("expected string as attribute name got " + attrName.type);
            }
            const attrValue = attr.value;
            props.push(t.objectProperty(t.identifier(attrName), t.stringLiteral(attrValue.value)));
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
