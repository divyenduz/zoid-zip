import Uint1Array from "uint1array";

type Uint1Array = Uint8Array;

export class Unpacker {
  constructor(public buffer: Buffer) {}

  readInt32() {
    return this.buffer.readInt32LE(0);
  }

  dropBits(n: number) {
    const startBytes = Math.floor(n / 8);
    const startBits = n % 8;
    const newBuffer = this.buffer.slice(startBytes);
    if (startBits > 0 && newBuffer.length > 0) {
      newBuffer[0] = newBuffer[0] & ((1 << (8 - startBits)) - 1);
    }
    this.buffer = newBuffer;
  }

  peek(n: number) {
    let peekBits = [];
    for (let i = 0; i < n; i++) {
      peekBits.push(this.readBit(0, i) << i);
    }
    console.log({ peekBits });
    return peekBits;
  }

  readBit(i: number, bit: number) {
    console.log(this.buffer);
    const bits = new Uint1Array(this.buffer);
    console.log({ bits: `${bits}` });
    console.log({ newBit: bits[i] });
    const readBit = (this.buffer[i] >> bit) % 2;
    console.log({ readBit });
    return readBit;
  }
}
