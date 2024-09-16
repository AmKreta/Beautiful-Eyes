import {bootstrap, ReactiveClass, Component, Effect, State, Computed} from '@beautiful-eyes/core';

@Component({
    useTemplate:'./app.template.html',
    useStyleSheets:[]
})
class Button extends ReactiveClass{
    @State() a = [1,2,3,4,5];
    @State() b = {key:'val'}

    @Effect(['a.length'])
    onAChange(){
        console.log('length of a changed to', this.a.length);
    }

    @Effect(['b.key'])
    logModification(){
        console.log('b is modified', this.b);
    }
}

const root = document.getElementById('root')!;
const btn = new Button();
(window as any).b = btn;
bootstrap(root, btn);

btn.a.push(...[1,2,3,4,5])
delete (btn as any).b.key;
