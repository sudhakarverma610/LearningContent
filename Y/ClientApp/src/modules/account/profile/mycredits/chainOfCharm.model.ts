export interface ChainOfCharm {
  parent: ChainOfCharmNode;
  children: ChainOfCharmNode[];
}

export interface ChainOfCharmNode {
  name: string;
  email: string;
}
