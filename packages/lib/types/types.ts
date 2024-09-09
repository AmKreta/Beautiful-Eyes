export enum NODE_TYPE{
    ELEMENT = 'element',
    FRAGMENT = 'fragment',
    COMPONENT = 'component',
    TEXT_NODE = 'text_node'
};

export interface IComponent{

};

export interface IProps{

}

export interface IDependencies{

}

export interface IHtmlObj{
    type: NODE_TYPE;
    kind: string | '' | IComponent;
    props: IProps;
    children:IHtmlObj[] | string;
}

export interface INode{
    type: NODE_TYPE;
    kind: string | '' | IComponent;
    props: IProps;
    children: INode[];
    parent: INode | null;
};