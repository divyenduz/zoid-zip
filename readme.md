# Introduction

`zoid-zip` is a tiny data compressor built for learning!

It works by creating a [huffman-coding](https://en.wikipedia.org/wiki/Huffman_coding)/prefix tree for the input data! Then compressed by encoding

1. input length
2. huffman-coding as a table (its length, each byte, size of bits, actual bits)
3. encoded original data

The decompressor works by decoding the input length, extracting the huffman-coding table from the compressed blob and re-constructing the input!

# Setup

```
pnpm install
```

(or npm or yarn)

# To Try

Either run

- `pnpm exec vite-node index.ts` - to try the hardcoded input

Or run

- `cat index.ts | pnpm exec vite-node index.ts compress | pnpm exec vite-node index.ts decompress` - to use any arbitrary output!

# Here is an example huffman-coding tree for this input

```
a
bb
ccc
dddd
eeeee
ffffff
ggggggg
hhhhhhhh
iiiiiiiii
jjjjjjjjjj
kkkkkkkkkkk
llllllllllll
mmmmmmmmmmmmm
nnnnnnnnnnnnnn
ooooooooooooooo
pppppppppppppppp
qqqqqqqqqqqqqqqqq
rrrrrrrrrrrrrrrrrr
sssssssssssssssssss
tttttttttttttttttttt
uuuuuuuuuuuuuuuuuuuuu
vvvvvvvvvvvvvvvvvvvvvv
wwwwwwwwwwwwwwwwwwwwwww
xxxxxxxxxxxxxxxxxxxxxxxx
yyyyyyyyyyyyyyyyyyyyyyyyy
zzzzzzzzzzzzzzzzzzzzzzzzzz
```

![Prefix tree coding](./examples/a-z/prefix-tree.png)
