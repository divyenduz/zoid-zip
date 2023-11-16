import { NodeType } from "./types";

export class Node {
  constructor(
    public left: NodeType,
    public right: NodeType,
    public count: number
  ) {}
}
