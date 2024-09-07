import { NodePath, PluginObj } from '@babel/core';
import * as t from '@babel/types';
import addExportStatement from './addExportStatement/addExportStatement';
import parseJSXElement from './parseJSXElement/parseJSXElement';

export default function MyBabelPlugin():PluginObj {
  return {
    visitor: {
      Program:{
        exit(path){
          addExportStatement(path, "template");
        }
      },
      JSXElement(path: NodePath<t.JSXElement>) {
        parseJSXElement(path);
      }
    }
  };
}
