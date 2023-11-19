import EventEmitter from "node:events";
import { NodeType, Node, Leaf } from "../types";

export function generateDotTree(
  tree: NodeType,
  traversalEventEmitter?: EventEmitter
) {
  const traversal: string[] = [];

  function dfs(tree: NodeType) {
    if (traversal.length > 0 && traversalEventEmitter) {
      traversalEventEmitter.emit("node", {
        dotOutput: wrapInDotDigraph(
          [`"(index=${traversal.length})"`].concat(traversal)
        ),
        index: traversal.length,
      });
    }
    if (!tree) {
      return ``;
    }
    if (tree instanceof Node && tree.left) {
      traversal.push(getNodeConnection(tree, "0"));
      dfs(tree.left);
    }
    if (tree instanceof Node && tree.right) {
      traversal.push(getNodeConnection(tree, "1"));
      dfs(tree.right);
    }
    return ``;
  }

  dfs(tree);

  const dotOutput = wrapInDotDigraph(traversal);
  if (traversalEventEmitter) {
    traversalEventEmitter.emit("end", {
      dotOutput,
      length: traversal.length,
    });
  }
  return dotOutput;
}

type Label = "0" | "1";

function getNodeConnection(node: Node, label: Label) {
  const nextNode = label === "0" ? node.left : node.right;
  const char = getCharForLeafNode(node, label);
  return `"(n=${node.count})" -> "${char}(n=${nextNode.count})" [label="${label}"]`;
}

function getCharForLeafNode(node: Node, label: Label) {
  const nextNode = label === "0" ? node.left : node.right;
  return nextNode instanceof Leaf
    ? String.fromCharCode(nextNode.byte) + " \n" // Also print the raw "byte" for leaf nodes
    : "";
}

function wrapInDotDigraph(traversal: string[]) {
  let dotOutput = "";
  dotOutput += "digraph G {\n";
  dotOutput += traversal.join("\n");
  dotOutput += "}\n";
  return dotOutput;
}
