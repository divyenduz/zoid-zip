import { uint8ArrayToHex } from "uint8array-extras";
import { compress } from "./compress";
import { decompress } from "./decompress";
import { stdin, stdout } from "process";
import arg from "arg";
import fs from "fs";

export const BUFFER_SIZE = 4 + 2 + 2000;
const args = arg({});

if (args._.length === 0) {
  const input = fs.readFileSync("./examples/a-z/input.txt", "utf-8");
  const compressed = compress(input);
  const decompressed = decompress(compressed);
  const buf = new ArrayBuffer(BUFFER_SIZE);
  const bytes = new Uint8Array(buf);
  bytes.set(compressed);
  const inputSize = Buffer.byteLength(input);
  const compressedSize = bytes.length;

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
      stdout.write(compress(data.toString()));
    }
    if (args._[0] === "decompress") {
      stdout.write(decompress(data));
    }
  });
}
