import {bootstrap, ReactiveClass, Component, Effect, State, Computed} from '@beautiful-eyes/core';

@Component({
    useTemplate:'./app.template.html',
    useStyleSheets:[]
})
class Button extends ReactiveClass{

    @State() a = {
        name:'amresh',
        value:[
            {val:1},
            {val:2},
            {val:3},
            {val:4},
            {val:5, detail:[1,2,3,4,5]}
        ]
    };
    
    @State() b = 5;

    c = [1,2,3,4,5];

    @Effect(['a.name']) 
    amk(){
        console.log('amk.name changed to ', this.a.name)
    } 

    @Computed(['a.name']) get name(){
        return 'amk';
    }

    @Effect(['name']) 
    onBChange(){
        console.log('b changed, new val ', this.b);
    }

    constructor(){
        super();
    }
    
    mounted(){
        console.log('button mounted');
    }

   

}

const root = document.getElementById('root')!;
const btn = new Button();
bootstrap(root, btn);

let x = new Button();

// should trigger effect
btn.a.name = "I love neha singh";

// should'nt trigger effect
btn.c = [1,2];

