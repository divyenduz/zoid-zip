import { Packer } from "./Packer";
import { buildTree, buildTable } from "./prefix-tree";
import { TableRow } from "./types";
import "./helpers/Uint1ArrayHelper";

export function compress(input: string) {
  const tree = buildTree(input);
  const table = buildTable(tree);

  const packer = new Packer();
  packer.writeInt32(input.length);

  packTable(table, packer);

  input.split("").forEach((byte) => {
    const bits = lookUpByte(table, byte.charCodeAt(0));
    packer.addBits(bits);
  });

  const packedBytes = packer.pack();
  return packedBytes;
}

function packTable(table: TableRow[], packer: Packer) {
  packer.writeInt8(table.length);
  table.forEach((row) => {
    packer.writeInt8(row.byte);
    packer.writeInt8(row.bits.length);
    packer.addBits(row.bits);
  });
}

function lookUpByte(table: TableRow[], byte: number) {
  const tableRow = table.find((row) => row.byte === byte);
  if (!tableRow) {
    throw new Error(`Byte ${byte} not found in table`);
  }
  return tableRow.bits;
}
