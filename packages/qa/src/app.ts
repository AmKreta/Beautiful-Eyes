import {bootstrap, ReactiveClass, Component, Effect, State, Computed} from '@beautiful-eyes/core';
import template from './app.template.be';
import './app.styles.scss'

@Component({
    useTemplate:template,
    useStyleSheets:[]
})
class Button extends ReactiveClass{
    @State() form = {userName:'', password:''};
    amk='neha'

    onUserNameChange(e:KeyboardEvent){
        this.form.userName = (e.target as HTMLInputElement)!.value;
    }

    onPasswordChange(e:KeyboardEvent){
        this.form.password = (e.target as HTMLInputElement)!.value;
    }

    @Effect((ctx:Button)=>[ctx.form.userName])
    onUsernameChange(oldValue:string){
        console.log('username changes',{oldValue, newValue:this.form.userName});
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
















