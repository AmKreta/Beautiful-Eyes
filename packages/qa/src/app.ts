import {bootstrap} from '@beautiful-eyes/core';
import {Component} from '@beautiful-eyes/core';

@Component({
    useTemplate:'./app.template.html',
    useStyleSheets:[]
})
class Button{

    mounted(){
        console.log('button mounted');
    }

}

const root = document.getElementById('root')!;
bootstrap(root, new Button());


