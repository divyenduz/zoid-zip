import { Leaf } from "../Leaf";
import { Node } from "../Node";
import { NodeType } from "../types";

export function generateDotTree(tree: NodeType) {
  const traversal: string[] = [];
  function dfs(tree: NodeType) {
    if (!tree) {
      return ``;
    }
    if (tree instanceof Node && tree.left) {
      const char =
        tree.left instanceof Leaf
          ? String.fromCharCode(tree.left.byte) + " \n"
          : "";
      traversal.push(
        `"(n=${tree.count})" -> "${char}(n=${tree.left.count})" [label="0"]`
      );
      dfs(tree.left);
    }
    if (tree instanceof Node && tree.right) {
      const char =
        tree.right instanceof Leaf
          ? String.fromCharCode(tree.right.byte) + " \n"
          : "";
      traversal.push(
        `"(n=${tree.count})" -> "${char}(n=${tree.right.count})" [label="1"]`
      );
      dfs(tree.right);
    }
    return ``;
  }

  dfs(tree);

  let dotOutput = "";
  dotOutput += "digraph G {\n";
  dotOutput += traversal.join("\n");
  dotOutput += "}\n";
  return dotOutput;
}
