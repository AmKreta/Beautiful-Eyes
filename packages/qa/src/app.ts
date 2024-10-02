import {bootstrap, ReactiveClass, Component, Effect, State, Computed} from '@beautiful-eyes/core';
import template from './app.template.be';
import './app.styles.scss'

@Component({
    useTemplate:template,
    useStyleSheets:[]
})
class Button extends ReactiveClass{
    @State() a = 10;

    constructor(){
        super();
       window.addEventListener('click',()=>this.a++);
    }
}


const root = document.getElementById('root')!;
const btn = new Button();
bootstrap(root, btn);
















