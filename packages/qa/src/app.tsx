import {bootstrap} from '@beautiful-eyes/core';

const a = <div>amk</div>

console.log(a);

const root = document.getElementById('root')!;

import('./app.template.html').then(module=>{
    console.log(module);
})

bootstrap(root );