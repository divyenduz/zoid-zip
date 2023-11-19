import { traversalToTree } from "./pack-tree";
import { extractBytes } from "./tree-utils/trie";
import { Unpacker } from "./binary-utils/Unpacker";

export function decompress(compressed: Uint8Array) {
  const unpacker = new Unpacker(compressed);
  const dataLength = unpacker.readInt32(); // dataLength
  const tree = unpackTree(unpacker);
  const { maxBitsLength, minBitsLength } = unpackMaxAndMinBitsInTable(unpacker);

  const bytes = extractBytes(
    unpacker,
    tree,
    dataLength,
    maxBitsLength,
    minBitsLength
  );
  return bytes.map((byte) => String.fromCharCode(byte)).join("");
}

export function unpackTree(unpacker: Unpacker) {
  const treeLength = unpacker.readInt8();
  const traversal: number[] = [];
  for (let i = 0; i < treeLength; i++) {
    const byte = unpacker.readInt8();
    traversal.push(byte);
  }
  const tree = traversalToTree(traversal);
  return tree;
}
function unpackMaxAndMinBitsInTable(unpacker: Unpacker): {
  maxBitsLength: any;
  minBitsLength: any;
} {
  const maxBitsLength = unpacker.readInt8();
  const minBitsLength = unpacker.readInt8();
  return { maxBitsLength, minBitsLength };
}
