import {bootstrap, ReactiveClass, Component, Effect, State, Computed} from '@beautiful-eyes/core';
import template from './app.template.html';

@Component({
    useTemplate:template,
    useStyleSheets:[]
})
class Button extends ReactiveClass{
    @State() a = [0,1,2,3,4];
    @State() b = {key:'val'};

    @Computed()
    get sumA(){
        return this.a.reduce((a, i)=>a+i, 0);
    }

    @Effect((ctx:Button)=>[ctx.a[0]])
    logModification(oldValue:number){
        console.log('a[0] -> ', {oldValue, newValue: this.a[0]});
    }

    @Effect((ctx:Button)=>[ctx.a[1]])
    logModification1(oldValue:number){
        console.log('a[1] -> ', {oldValue, newValue: this.a[1]});
    }  

    @Effect((ctx:Button)=>[ctx.sumA])
    onArrSumChange(oldValue:number){
        console.log(`sum of array a changed from`, oldValue, 'to', this.sumA);
    }

    
}


const root = document.getElementById('root')!;
const btn = new Button();
bootstrap(root, btn);

btn.a[0] = 1;
btn.a[1] = 2;

btn.a[0] = 100;
btn.a[1] = 200;
















