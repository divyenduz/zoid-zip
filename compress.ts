import { Packer } from "./Packer";
import { buildTree, buildTable } from "./prefix-tree";
import { TableRow } from "./types";
import "./helpers/Uint1ArrayHelper";

export function compress(input: string) {
  const tree = buildTree(input);
  const table = buildTable(tree);

  const compressedSize = findSize(input, table);

  const packer = new Packer(compressedSize);
  packer.writeInt32(input.length);

  packTable(table, packer);

  input.split("").forEach((byte) => {
    const bits = lookUpByte(table, byte.charCodeAt(0));
    packer.addBits(bits);
  });

  const packedBytes = packer.pack();
  return { compressed: packedBytes, compressedSize };
}

function packTable(table: TableRow[], packer: Packer) {
  packer.writeInt8(table.length);

  let maxBitsLength = Number.NEGATIVE_INFINITY;
  let minBitsLength = Number.POSITIVE_INFINITY;

  table.forEach((row) => {
    if (row.byte > 255) {
      throw new Error(`Byte ${row.byte} is greater than 255`);
    }

    packer.writeInt8(row.byte);
    packer.writeInt8(row.bits.length);
    packer.addBits(row.bits);

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

function findSize(input: string, table: TableRow[]) {
  const inputFrequencyTable = frequencyTable(input);

  return (
    4 + // 32 bit integer storing length of input
    tableSize(table) + // Size of the packed hoffman-coding table
    encodedInputSize(inputFrequencyTable, table) // Size of the encoded input
  );
}

function tableSize(table: TableRow[]) {
  return (
    1 + // 8 bit integer storing number of rows in table, 1 byte
    1 * table.length + // 8 bit integer for each byte in the table, 1 byte
    1 * table.length + // 8 bit integer for each length of bits in the table, 1 byte
    1 + // 8 bit integer storing max length of bits in the table, 1 byte
    1 + // 8 bit integer storing min length of bits in the table, 1 byte
    tableDataSize(table) // Size of the packed bits in the table, in bytes
  );
}

function tableDataSize(table: TableRow[]) {
  const bits = table.reduce((acc, row) => acc + row.bits.length, 0); // 1 bit for each bit in the table
  return Math.ceil(bits / 8);
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
