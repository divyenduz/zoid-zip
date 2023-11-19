export type NodeType = Node | Leaf;

export class Node {
  constructor(
    public left: NodeType,
    public right: NodeType,
    public count: number
  ) {}
}

export class Leaf {
  constructor(public byte: number, public count: number) {}
}

export class TableRow {
  constructor(public byte: number, public bits: number[]) {}
}
