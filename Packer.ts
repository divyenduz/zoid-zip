export class Packer {
  bits: number[] = [];
  constructor() {}

  writeInt32(value: number) {
    for (let i = 0; i < 32; i++) {
      this.bits.push((value >> i) % 2);
    }
  }

  bitsToBytes(bits: number[]) {
    bits.forEach((bit) => {
      this.bits.push(bit);
    });
  }

  readBit(buffer: Buffer, i: number, bit: number) {
    return (buffer[i] >> bit) % 2;
  }

  setBit(buffer: Buffer, i: number, bit: number, value: number) {
    if (value == 0) {
      buffer[i] &= ~(1 << bit);
    } else {
      buffer[i] |= 1 << bit;
    }
  }

  pack() {
    const buffer = Buffer.alloc(Math.ceil(this.bits.length / 8));
    this.bits.forEach((bit, index) => {
      this.setBit(buffer, Math.floor(index / 8), index % 8, bit);
    });
    return buffer;
  }
}
