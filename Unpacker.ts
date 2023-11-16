import Uint1Array from "uint1array";
import { BUFFER_SIZE } from ".";

export class Unpacker {
  buf: ArrayBuffer;
  bytes: Uint8Array;
  bits: Uint1Array;
  position: number = 0;
  constructor(public compressed: Uint8Array) {
    this.buf = new ArrayBuffer(BUFFER_SIZE);
    this.bytes = new Uint8Array(this.buf);
    this.bits = new Uint1Array(this.buf);
    this.bytes.set(compressed);
  }

  readInt32() {
    const bits = this.readBits(32);
    const binary = bits.reverse().join("");
    const length = parseInt(binary, 2);
    return length;
  }

  readInt8() {
    const bits = this.readBits(8);
    const binary = bits.reverse().join("");
    const length = parseInt(binary, 2);
    return length;
  }

  readBits(n: number) {
    const peekBits = this.bits.subarray(this.position, this.position + n);
    this.dropBits(n);
    return Array.from(peekBits);
  }

  dropBits(n: number) {
    this.position += n;
  }

  peek(n: number) {
    const peekBits = this.bits.subarray(this.position, this.position + n);
    return peekBits;
  }
}
