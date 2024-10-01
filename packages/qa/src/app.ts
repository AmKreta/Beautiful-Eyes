import {bootstrap, ReactiveClass, Component, Effect, State, Computed} from '@beautiful-eyes/core';
import template from './app.template.be';
import './app.styles.scss'

@Component({
    useTemplate:template,
    useStyleSheets:[]
})
class Button extends ReactiveClass{
    @State() a = 1;

    constructor(){
        super();

        setInterval(()=>{
            this.a++;
        }, 1000);
    }

    submit(){
        alert('submitting');
    }
}


const root = document.getElementById('root')!;
const btn = new Button();
bootstrap(root, btn);

// btn.a[0] = 1;
// btn.a[1] = 2;

// btn.a[0] = 100;
// btn.a[1] = 200;
















