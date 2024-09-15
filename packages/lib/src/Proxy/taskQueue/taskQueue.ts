import {Queue} from '../../Queue/queue';

export type MutationCallback = (path:string)=>void

export interface BatchedUpdates{
    comitBatchedItems:Function
}

export type Task = {
    cb:MutationCallback,
    context:BatchedUpdates ,
    args:{path:string}
};

type Context = any;
type Path = string;
type Tasks = Map<Context , Map<Path, Queue<Task>>>

export class TaskQueue {
    private tasks:Tasks = new Map();
    private idleCallbackRunning = false;

    public push(task:Task){
        let contextTasks = this.tasks.get(task.context);
        if(!contextTasks){
            contextTasks = new Map();
            const contextPathTasks = new Queue<Task>();
            contextPathTasks.push(task);
            contextTasks.set(task.args.path, contextPathTasks);
            this.tasks.set(task.context, contextTasks);
        }
        else{
            const contextPathTasks = contextTasks.get(task.args.path)!;
            contextPathTasks.push(task);
        }
        this.runTasksAsIdleCallback();
    }

    performTask:IdleRequestCallback = (deadline:IdleDeadline)=> {
        // contextTask contains all the tasks in a component
        // pathTask contains all the tasks dependent on a particular path
        for(let [context, contextTasks] of this.tasks){
            for(let [path, pathTasks] of contextTasks){
                while(deadline.timeRemaining()>0 && pathTasks.length>0){
                    const task = pathTasks.pop();
                    task && this.runTask(task);
                }
                if(pathTasks.length){
                    requestIdleCallback(this.performTask);
                }
                else {
                    contextTasks.delete(path);
                    this.idleCallbackRunning = false;
                }
            }
            if(!contextTasks.size) {
                this.tasks.delete(context);
                if(!context.comitBatchedItems){
                    throw new Error('bacthing onlt possible for classes implementing BatchedUpdates interface');
                }
                context.comitBatchedItems();
            }
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