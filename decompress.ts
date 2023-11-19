import { buildTree } from "./prefix-tree";
import { extractBytes } from "./trie";
import { TableRow } from "./types";
import { Unpacker } from "./Unpacker";

export function decompress(compressed: Uint8Array, input: string) {
  const unpacker = new Unpacker(compressed);
  const tree = buildTree(input);
  const bytes = extractBytes(tree, compressed);
  return bytes.map((byte) => String.fromCharCode(byte)).join("");
}

export function unpackTable(unpacker: Unpacker) {
  const tableLength = unpacker.readInt8();
  const table: TableRow[] = [];
  for (let i = 0; i < tableLength; i++) {
    const byte = unpacker.readInt8();
    const bitsLength = unpacker.readInt8();
    const bits = unpacker.readBits(bitsLength) as unknown as number[];
    table.push(new TableRow(byte, bits));
  }
  const maxBitsLength = unpacker.readInt8();
  const minBitsLength = unpacker.readInt8();
  return { table, maxBitsLength, minBitsLength };
}
