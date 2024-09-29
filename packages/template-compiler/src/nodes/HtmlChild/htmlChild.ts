import { Interpolation } from "../interpolation/interpolation";
import { StringNode } from "../string/string";
import {HtmlElement} from '../HtmlElement/HtmlElement';
import { IfElse } from "../ifElse/ifElse";

export type HtmlChild = HtmlElement | Interpolation | StringNode | IfElse;
export type htmlChildren = HtmlChild[];