import {bootstrap, ReactiveClass, Component, Effect, State, } from '@beautiful-eyes/core';

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

    @Effect(['a.name']) amk(){
        console.log('amk.name changed')
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

btn.a.name = "neha singh";



