import { NodeType, Node, Leaf } from "./types";

const INTERNAL_NODE_SYMBOL = 31; // ASCII Unit Separator

export function preorderTraversal(tree: NodeType, traversal: number[] = []) {
  if (tree instanceof Leaf) {
    traversal.push(tree.byte);
  } else {
    traversal.push(INTERNAL_NODE_SYMBOL);
    preorderTraversal(tree.left, traversal);
    preorderTraversal(tree.right, traversal);
  }

  return traversal;
}

export function traversalToTree(traversal: number[]) {
  const stack: NodeType[] = [];
  for (let i = traversal.length - 1; i >= 0; i--) {
    const byte = traversal[i];
    if (byte === INTERNAL_NODE_SYMBOL) {
      const left = stack.pop();
      const right = stack.pop();
      stack.push(new Node(left!, right!, 0));
    } else {
      stack.push(new Leaf(byte, 0));
    }
  }
  return stack[0];
}
