export type NODE_TYPE = 'element' | 'fragment' | 'component';

export interface IComponent{

};

export interface IProps{

}

export interface IDependencies{

}

export interface INode{
    type: NODE_TYPE;
    kind: string | '' | IComponent;
    props: IProps;
    children: INode[];
    parent: INode | null;
};