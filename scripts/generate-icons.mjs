/**
 * Generates PWA icon PNGs (192x192 and 512x512).
 * Run: node scripts/generate-icons.mjs
 * Zero dependencies — uses only Node built-ins.
 */

import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { deflateSync } from 'zlib';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

function crc32(buf) {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    table[n] = c;
  }
  let crc = -1;
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  return (crc ^ -1) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeB = Buffer.from(type);
  const body = Buffer.concat([typeB, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function generateIcon(size) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdrBody = Buffer.alloc(13);
  ihdrBody.writeUInt32BE(size, 0);
  ihdrBody.writeUInt32BE(size, 4);
  ihdrBody[8] = 8;   // bit depth
  ihdrBody[9] = 2;   // RGB color
  ihdrBody[10] = 0;  // compression
  ihdrBody[11] = 0;  // filter
  ihdrBody[12] = 0;  // interlace
  const ihdr = makeChunk('IHDR', ihdrBody);

  const rowBytes = 1 + size * 3;
  const raw = Buffer.alloc(rowBytes * size);
  const cx = size / 2, cy = size / 2;
  const outerR = size * 0.40;
  const ringW = size * 0.035;

  for (let y = 0; y < size; y++) {
    const rowOff = y * rowBytes;
    raw[rowOff] = 0; // filter: none
    for (let x = 0; x < size; x++) {
      const px = rowOff + 1 + x * 3;
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);

      if (dist < outerR - ringW) {
        raw[px] = 255; raw[px + 1] = 248; raw[px + 2] = 240; // #FFF8F0
      } else if (dist < outerR) {
        raw[px] = 232; raw[px + 1] = 160; raw[px + 2] = 191; // #E8A0BF
      } else {
        raw[px] = 249; raw[px + 1] = 228; raw[px + 2] = 228; // #F9E4E4
      }
    }
  }

  const compressed = deflateSync(raw, { level: 9 });
  const idat = makeChunk('IDAT', compressed);
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

console.log('Generating PWA icons...');
for (const size of [192, 512]) {
  const png = generateIcon(size);
  const outPath = join(publicDir, `icon-${size}.png`);
  writeFileSync(outPath, png);
  console.log(`  icon-${size}.png (${(png.length / 1024).toFixed(1)} KB)`);
}
console.log('Done!');
