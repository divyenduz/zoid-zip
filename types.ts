import { Leaf } from "./Leaf";
import { Node } from "./Node";

export type NodeType = Node | Leaf;

export class TableRow {
  constructor(public byte: number, public bits: number[]) {}
}
