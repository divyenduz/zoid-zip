import Uint1Array from "uint1array";

type Uint1Array = Uint8Array;

const chunks = (arr, size) =>
  Array.from(new Array(Math.ceil(arr.length / size)), (_, i) => {
    const chunk = arr.slice(i * size, i * size + size);
    const chunkStr = chunk.reverse().join("");
    const hex = parseInt(chunkStr, 2)
      .toString(16)
      .padStart(2, "0")
      .toUpperCase();
    return chunkStr.padStart(8, "0") + " " + hex;
  });

Uint1Array.prototype.toString = function () {
  return chunks(Array.from(this), 8).join("\n");
};
