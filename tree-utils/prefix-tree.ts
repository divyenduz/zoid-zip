import { NodeType, Node, Leaf, TableRow } from "../types";

export function buildTree(str: string) {
  const frequencyMap: Record<number, number> = {};
  str.split("").forEach((byte) => {
    frequencyMap[byte.charCodeAt(0)] =
      (frequencyMap[byte.charCodeAt(0)] || 0) + 1;
  });
  const sortedKeys = Object.keys(frequencyMap).sort((a, b) => {
    return frequencyMap[parseInt(a)] - frequencyMap[parseInt(b)];
  });
  const nodes: Array<Node | Leaf> = sortedKeys.map((key) => {
    return new Leaf(parseInt(key), frequencyMap[parseInt(key)]);
  });
  while (nodes.length > 1) {
    const node0 = nodes.shift();
    const node1 = nodes.shift();
    const newNode = new Node(
      node0!,
      node1!,
      (node0?.count || 0) + (node1?.count || 0)
    );
    nodes.push(newNode);
    nodes.sort((a, b) => a.count - b.count);
  }
  return nodes[0];
}

export function buildTable(
  node: NodeType,
  path: number[] = []
): Array<TableRow> {
  if (node instanceof Node) {
    // is node
    const left = buildTable(node.left, path.concat([0]));
    const right = buildTable(node.right, path.concat([1]));
    return left.concat(right);
  } else {
    // is leaf
    return [new TableRow(node.byte, path)];
  }
}
