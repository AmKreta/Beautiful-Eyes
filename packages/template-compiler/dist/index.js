"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MyBabelPlugin;
const addExportStatement_1 = __importDefault(require("./addExportStatement/addExportStatement"));
const parseJSXElement_1 = __importDefault(require("./parseJSXElement/parseJSXElement"));
function MyBabelPlugin() {
    return {
        visitor: {
            Program: {
                exit(path) {
                    (0, addExportStatement_1.default)(path, "template");
                }
            },
            JSXElement(path) {
                (0, parseJSXElement_1.default)(path);
            }
        }
    };
}
