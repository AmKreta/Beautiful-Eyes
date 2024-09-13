import {Queue} from '../../Queue/queue';

export type MutationCallback = (path:string)=>void

export type Task = {
    cb:MutationCallback,
    context:any,
    args:{path:string}
};

export class TaskQueue {
    private queue = new Queue<Task>();
    private idleCallbackRunning = false;

    public push(task:Task){
        this.queue.push(task);
        this.runTasksAsIdleCallback();
    }

    performTask:IdleRequestCallback = (deadline:IdleDeadline)=> {
        while (deadline.timeRemaining() > 0 && this.queue.length > 0) {
            const task = this.queue.pop();
            task && this.runTask(task);
        }
        if (this.queue.length > 0) {
            requestIdleCallback(this.performTask);
        }
        else{
            this.idleCallbackRunning = false;
        }
    }

    runTask(task:Task){
        const {cb, context, args} = task;
        cb.call(context, args.path)
    }

    runTasksAsIdleCallback(){
        if(!this.idleCallbackRunning){
            this.idleCallbackRunning = true;
            requestIdleCallback(this.performTask);
        }
    }
}