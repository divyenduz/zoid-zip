import { TableRow } from "./types";
import { Unpacker } from "./Unpacker";

export function decompress(compressed: Uint8Array) {
  const unpacker = new Unpacker(compressed);
  const dataLength = unpacker.readInt32();
  const table = unpackTable(unpacker);

  const bytes: number[] = [];
  for (let i = 0; i < dataLength; i++) {
    const byte = lookUpBits(table, unpacker);
    bytes.push(byte);
  }
  return bytes.map((byte) => String.fromCharCode(byte!)).join("");
}

function unpackTable(unpacker: Unpacker) {
  const tableLength = unpacker.readInt8();
  const table: TableRow[] = [];
  for (let i = 0; i < tableLength; i++) {
    const byte = unpacker.readInt8();
    const bitsLength = unpacker.readInt8();
    const bits = unpacker.readBits(bitsLength) as unknown as number[];
    table.push(new TableRow(byte, bits));
  }
  return table;
}

function lookUpBits(table: TableRow[], unpacker: Unpacker) {
  const matchedRow = table.find((row) => {
    if (
      JSON.stringify(row.bits) ===
      JSON.stringify(unpacker.peek(row.bits.length))
    ) {
      unpacker.dropBits(row.bits.length);
      return true;
    } else {
      return false;
    }
  });
  if (!matchedRow) {
    throw new Error(`No matching row found`);
  }
  return matchedRow.byte;
}
