import {INode, IComponent, IProps, NODE_TYPE } from '../types/types';

export default class Node implements INode{
    type: NODE_TYPE;
    kind: string | '' | IComponent;
    props: IProps;
    children: INode[];
    parent: INode | null;
}