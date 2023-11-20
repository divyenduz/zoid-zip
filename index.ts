import { uint8ArrayToHex } from "uint8array-extras";
import { compress } from "./compress";
import { decompress } from "./decompress";
import { stdin, stdout } from "process";
import arg from "arg";
import fs from "fs";
import { prefixTreeCommand } from "./commands/prefix-tree";
import "./helpers/Uint1ArrayHelper";

const args = arg({});

if (args._[0] === "prefix-tree") {
  const example = "basic";
  const input = fs.readFileSync(`./examples/${example}/input.txt`, "ascii");
  await prefixTreeCommand(input, example);
  process.exit(0);
}

if (args._.length === 0) {
  const example = "a-z";
  const input = fs.readFileSync(`./examples/${example}/input.txt`, "ascii");
  const { compressed, compressedSize } = compress(input);
  const decompressed = decompress(compressed);
  const inputSize = Buffer.byteLength(input);

  if (input !== decompressed) {
    console.error(`It didn't decompress properly`);
  }

  console.table({
    input: input.slice(0, 50),
    decompressed: decompressed.slice(0, 50),
    inputSize,
    compressed: uint8ArrayToHex(compressed).toUpperCase().slice(0, 50),
    compressedSize,
    compressionRatio:
      ((inputSize - compressedSize) / compressedSize) * 100 + "%",
  });
} else {
  // echo 'abbcccc' | pnpm exec vite-node index.ts compress | pnpm exec vite-node index.ts decompress
  let chunks: Buffer[] = [];
  stdin.on("data", (chunk) => {
    chunks.push(chunk);
  });
  stdin.on("end", () => {
    const data = Buffer.concat(chunks);
    if (args._[0] === "compress") {
      const { compressed } = compress(data.toString());
      stdout.write(compressed);
    }
    if (args._[0] === "decompress") {
      const decompressed = decompress(data);
      stdout.write(decompressed);
    }
  });
}
