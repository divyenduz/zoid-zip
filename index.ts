import { Node } from "./Node";
import { Packer } from "./Packer";
import { Unpacker } from "./Unpacker";
import { buildTree } from "./prefix-tree";
import { NodeType } from "./types";

function decompress(table: TableRow[], compressed: Buffer) {
  const unpacker = new Unpacker(compressed);
  const dataLength = unpacker.readInt32();
  unpacker.dropBits(32);
  console.log({ dataLength });
  const bytes = [];
  for (let i = 0; i < dataLength; i++) {
    const byte = lookUpBits(table, unpacker);
    bytes.push(byte);
  }
  return bytes.map((byte) => String.fromCharCode(byte!)).join("");
}

function lookUpBits(table: TableRow[], unpacker: Unpacker) {
  const bytes = table.map((row) => {
    console.log(row);
    if (
      JSON.stringify(row.bits) ===
      JSON.stringify(unpacker.peek(row.bits.length))
    ) {
      console.log({ bufferBefore: unpacker.buffer });
      unpacker.dropBits(row.bits.length);
      console.log({ bufferAfter: unpacker.buffer });
      return row.byte;
    }
  });
  return bytes[0];
}

function compress(input: string) {
  const tree = buildTree(input);
  const table = buildTable(tree);
  const packer = new Packer();
  packer.writeInt32(input.length);
  input.split("").forEach((byte) => {
    const bits = lookUpByte(table, byte.charCodeAt(0));
    packer.bitsToBytes(bits);
  });

  const packedBytes = packer.pack();
  return packedBytes;
}

function lookUpByte(table: TableRow[], byte: number) {
  const tableRow = table.find((row) => row.byte === byte);
  if (!tableRow) {
    throw new Error(`Byte ${byte} not found in table`);
  }
  return tableRow.bits;
}

class TableRow {
  constructor(public byte: number, public bits: number[]) {}
}

function buildTable(node: NodeType, path: number[] = []): Array<TableRow> {
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

const input = "abbcccc";
const compressed = compress(input);
console.log({ compressed });
const tree = buildTree(input);
const table = buildTable(tree);
// const decompressed = decompress(table, compressed);
// console.log({ input, decompressed });
