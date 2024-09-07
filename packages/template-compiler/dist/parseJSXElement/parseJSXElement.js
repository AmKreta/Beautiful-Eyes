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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = parseJSXElement;
const t = __importStar(require("@babel/types"));
const parseParams_component_1 = __importDefault(require("../parseAttributes/parseParams.component"));
const parseChildren_1 = __importDefault(require("../parseChildren/parseChildren"));
function parseJSXElement(path) {
    const openingElement = path.node.openingElement;
    const elementName = openingElement.name.name;
    const attributes = openingElement.attributes;
    const props = (0, parseParams_component_1.default)(attributes);
    const children = (0, parseChildren_1.default)(path);
    path.replaceWith(t.objectExpression([
        t.objectProperty(t.identifier('type'), t.stringLiteral('element')),
        t.objectProperty(t.identifier('kind'), t.stringLiteral(elementName)),
        t.objectProperty(t.identifier('props'), t.objectExpression(props)),
        t.objectProperty(t.identifier('children'), t.arrayExpression(children))
    ]));
}
