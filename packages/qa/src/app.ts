import {bootstrap, ReactiveClass, Component, Effect, State} from '@beautiful-eyes/core';

@Component({
    useTemplate:'./app.template.html',
    useStyleSheets:[]
})
class Button extends ReactiveClass{
    @State() a = [1,2,3,4,5];
    @State() b = {key:'val'}

    @Effect(['a.length'])
    onAChange(){
        console.log('length of a changed to ', this.a.length);
    }

    @Effect(['b.key'])
    logModification(){
        console.log('b.key is changed to ', this.b.key);
    }
}

const root = document.getElementById('root')!;
const btn = new Button();
(window as any).b = btn;
bootstrap(root, btn);

// should trigger effect only once
btn.a.push(...[1,2,3,4,5])

// should trigger effect
delete (btn as any).b.key;

setTimeout(()=>{
    btn.a.splice(5,5);
    console.log(btn.a)
},1000)

















