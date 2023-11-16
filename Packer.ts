import Uint1Array from "uint1array";
import { BUFFER_SIZE } from ".";

export class Packer {
  buf: ArrayBuffer;
  bytes: Uint8Array;
  bits: Uint1Array;
  position: number = 0;
  constructor() {
    this.buf = new ArrayBuffer(BUFFER_SIZE);
    this.bytes = new Uint8Array(this.buf);
    this.bits = new Uint1Array(this.buf);
  }

  writeInt32(value: number) {
    const bits = value
      .toString(2) // Convert number to equivalent bit string!
      .padStart(32, "0") // pad it with necessary number of zeroes
      .split("") // split it to get each bit
      .map((bit) => parseInt(bit)) // turn it into a number, slow-ish?
      .reverse() // reverse it for order!
      .forEach((bit) => {
        this.bits[this.position] = bit;
        this.position++;
      });
  }

  writeInt8(value: number) {
    const bits = value
      .toString(2) // Convert number to equivalent bit string!
      .padStart(8, "0") // pad it with necessary number of zeroes
      .split("") // split it to get each bit
      .map((bit) => parseInt(bit)) // turn it into a number, slow-ish?
      .reverse() // reverse it for order!
      .forEach((bit) => {
        this.bits[this.position] = bit;
        this.position++;
      });
  }

  addBits(bits: number[]) {
    bits.forEach((bit) => {
      this.bits[this.position] = bit;
      this.position++;
    });
  }

  pack() {
    return this.bytes;
  }
}
