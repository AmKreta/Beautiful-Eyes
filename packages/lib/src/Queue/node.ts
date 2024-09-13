export interface INode<T>{
    value:T,
    next: INode<T> | null;
    prev: INode<T> | null;
};

export class Node<T> implements INode<T>{
    constructor(
        public value:T,
        public next:INode<T> | null,
        public prev:INode<T> | null
    ){}
};