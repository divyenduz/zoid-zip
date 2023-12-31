import { Unpacker } from "../binary-utils/Unpacker";
import { NodeType, Node, Leaf } from "../types";

export function extractBytes(
  unpacker,
  tree,
  dataLength,
  maxBitsLength,
  minBitsLength
) {
  let outputBytes: number[] = [];
  for (let i = 0; i < dataLength; i++) {
    const byte = findNextByte(tree, unpacker, maxBitsLength, minBitsLength);
    outputBytes.push(byte);
  }

  return outputBytes;
}

export function findNextByte(
  tree: NodeType,
  unpacker: Unpacker,
  maxBitsLength: number,
  minBitsLength: number
) {
  let nextByteLengthInBits = minBitsLength;
  while (nextByteLengthInBits <= maxBitsLength) {
    const possibleNextByte = Array.from(
      unpacker.peek(nextByteLengthInBits)
    ) as number[];
    const isNextByteInTree = trieSearch(tree, possibleNextByte);
    if (isNextByteInTree.found === true) {
      unpacker.dropBits(nextByteLengthInBits);
      nextByteLengthInBits = minBitsLength;
      return isNextByteInTree.byte;
    } else {
      nextByteLengthInBits++;
    }
  }
  throw new Error(`No matching byte found`);
}

function trieSearch(tree: NodeType, possibleNextByte: number[]) {
  let cloneTree = tree;
  for (let i = 0; i < possibleNextByte.length; i++) {
    const nextBit = possibleNextByte[i];
    if (nextBit === 0) {
      if (cloneTree instanceof Node) {
        cloneTree = cloneTree.left;
      } else {
        return { found: false as const, byte: null };
      }
    } else {
      if (cloneTree instanceof Node) {
        cloneTree = cloneTree.right;
      } else {
        return { found: false as const, byte: null };
      }
    }
  }
  if (cloneTree && cloneTree instanceof Leaf) {
    return { found: true as const, byte: cloneTree.byte };
  } else {
    return { found: false as const, byte: null };
  }
}
