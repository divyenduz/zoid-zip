import { Packer } from "./binary-utils/Packer";
import { buildTree, buildTable } from "./tree-utils/prefix-tree";
import { NodeType, TableRow } from "./types";
import { preorderTraversal } from "./tree-utils/pack-tree";

export function compress(input: string) {
  const tree = buildTree(input);
  const table = buildTable(tree);
  const compressedSize = findSize(input, table, tree);

  const packer = new Packer(compressedSize);
  packer.writeInt32(input.length);

  packTree(tree, packer);
  packMaxAndMinBitsInTable(table, packer);

  input.split("").forEach((byte) => {
    const bits = lookUpByte(table, byte.charCodeAt(0));
    packer.addBits(bits);
  });

  const packedBytes = packer.pack();
  return { compressed: packedBytes, compressedSize };
}

function packTree(tree: NodeType, packer: Packer) {
  const traversal = preorderTraversal(tree);
  packer.writeInt8(traversal.length);
  traversal.forEach((byte) => {
    if (byte > 255) {
      throw new Error(`Byte ${byte} is greater than 255`);
    }
    packer.writeInt8(byte);
  });
}

function packMaxAndMinBitsInTable(table: TableRow[], packer: Packer) {
  let maxBitsLength = Number.NEGATIVE_INFINITY;
  let minBitsLength = Number.POSITIVE_INFINITY;

  table.forEach((row) => {
    if (row.bits.length > maxBitsLength) {
      maxBitsLength = row.bits.length;
    }
    if (row.bits.length < minBitsLength) {
      minBitsLength = row.bits.length;
    }
  });
  packer.writeInt8(maxBitsLength);
  packer.writeInt8(minBitsLength);
}

function lookUpByte(table: TableRow[], byte: number) {
  const tableRow = table.find((row) => row.byte === byte);
  if (!tableRow) {
    throw new Error(`Byte ${byte} not found in table`);
  }
  return tableRow.bits;
}

export function findSize(input: string, table: TableRow[], tree: NodeType) {
  const inputFrequencyTable = frequencyTable(input);

  return (
    4 + // 32 bit integer storing length of input
    // tableSize(table) + // Size of the packed hoffman-coding table
    treeSize(tree) + // Size of the packed prefix tree
    1 + // 8 bit integer storing max length of bits in the table, 1 byte
    1 + // 8 bit integer storing min length of bits in the table, 1 byte
    encodedInputSize(inputFrequencyTable, table) // Size of the encoded input
  );
}

function treeSize(tree: NodeType) {
  const traversal = preorderTraversal(tree);
  return (
    1 + // +1 byte for storing the length of the traversal;
    traversal.length
  );
}

/**
 *
 *
 * Example: abbccc
 * Returns: { a: 1, b: 2, c: 3 }
 *
 * @param input string
 * @returns Record<string, number>
 */
function frequencyTable(input: string) {
  return input.split("").reduce((acc, byte) => {
    if (!acc[byte]) {
      acc[byte] = 0;
    }
    acc[byte]++;
    return acc;
  }, {} as Record<string, number>);
}

function encodedInputSize(
  inputFrequencyTable: Record<string, number>,
  table: TableRow[]
) {
  const bits = Object.entries(inputFrequencyTable).reduce(
    (acc, [byte, frequency]) => {
      const tableRow = table.find((row) => row.byte === byte.charCodeAt(0));
      if (!tableRow) {
        throw new Error(`Byte ${byte} not found in table`);
      }
      return acc + tableRow.bits.length * frequency;
    },
    0
  );
  return Math.ceil(bits / 8);
}
