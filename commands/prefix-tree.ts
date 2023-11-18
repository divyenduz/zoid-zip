import EventEmitter from "events";
import { toFile } from "ts-graphviz/adapter";
import { generateDotTree } from "../helpers/render";
import { buildTree } from "../prefix-tree";

export async function prefixTreeCommand(input: string, example: string) {
  const tree = buildTree(input);
  const traversalEventEmitter = new EventEmitter();
  traversalEventEmitter.on("node", async ({ dotOutput, index }) => {
    const path = `./examples/${example}/animation/${index}.png`;
    // convert -gravity center -background white -extent 2607x1129 -delay 30 -loop 0 $(ls *.png | sort -V) animation.gif
    try {
      await toFile(dotOutput, path, {
        format: "png",
      });
    } catch (e) {
      console.error(e);
    }
  });

  const dotOutput = generateDotTree(tree, traversalEventEmitter);

  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
  console.log(dotOutput);
}
