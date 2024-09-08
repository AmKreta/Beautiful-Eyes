import {bootstrap} from '@beautiful-eyes/core';
import {Component} from '@beautiful-eyes/core';

console.log(bootstrap)

import('./app.template.html').then(res=>{
    console.log(res.default)
});

@Component({
    useTemplate:'./app.template.html',
    useStyleSheets:[]
})
class Button{

}


