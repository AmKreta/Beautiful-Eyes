export interface BatchedUpdates{
    comitBatchedItems:Function
}

export type Task = {
    cb:Function,
    context:BatchedUpdates
};

type Context = any;
type Tasks = Map<Context , Set<Function>>

export class TaskQueue {
    private tasks:Tasks = new Map();
    private idleCallbackRunning = false;

    public push(task:Task){
        let contextTasks = this.tasks.get(task.context);
        if(!contextTasks){
            contextTasks = new Set<Function>();
            this.tasks.set(task.context, contextTasks);
        }
        contextTasks.add(task.cb);
        this.runTasksAsIdleCallback();
    }

    performTask:IdleRequestCallback = (deadline:IdleDeadline)=> {
        // contextTask contains all the tasks in a component
        // pathTask contains all the tasks dependent on a particular path
        for(let [context, contextTasks] of this.tasks){
            for(let cb of contextTasks){
                if(deadline.timeRemaining()>0){
                    this.runTask(context, cb);
                    contextTasks.delete(cb);
                }
                else{
                    this.idleCallbackRunning = false;
                    this.runTasksAsIdleCallback();
                    return;
                }
            }
        }
    }

    runTask(context:any, cb:Function){
      cb.call(context)
    }

    runTasksAsIdleCallback(){
        if(!this.idleCallbackRunning){
            this.idleCallbackRunning = true;
            requestIdleCallback(this.performTask);
        }
    }
}