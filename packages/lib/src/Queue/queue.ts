import { INode, Node } from "./node";

export interface ILinkList<T> {
    start: INode<T> | null;
    end: INode<T> | null;
    push(item: T): void;
    pop(): T | null;
    length: number;
}

export class Queue<T> implements ILinkList<T> {
    start: INode<T> | null = null;
    end: INode<T> | null = null;
    length: number = 0;

    public push(item: T) {
        const node = new Node<T>(item, null, null);
        if(!this.start){
            this.start = node;
            this.end = node;
            this.length = 1;
        }
        else{
            node.prev = this.end;
            if (this.end) 
                this.end.next = node;
            this.end = node;
            this.length ++;
        }
    }

    public pop(): T | null{
        if (!this.start) return null;
        const value = this.start.value;
        if (this.start === this.end) {
            this.start = null;
            this.end = null;
        } else {
            this.start = this.start.next;
            if (this.start) {
                this.start.prev = null;
            }
        }
        this.length--;
        return value;
    }
};
