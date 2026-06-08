/**
 * Genera iconos PNG simples para PWA y Android (192 y 512 px).
 * Ejecutar: node scripts/generate-icons.mjs
 */
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import zlib from "zlib";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "icons");
const resDir = join(__dirname, "..", "resources");

mkdirSync(outDir, { recursive: true });
mkdirSync(resDir, { recursive: true });

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let j = 0; j < 8; j++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
  }
  return ~c >>> 0;
}

function pngChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type);
  const crcBuf = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(crcBuf));
  return Buffer.concat([len, typeBuf, data, crc]);
}

function createIcon(size) {
  const raw = Buffer.alloc(size * (1 + size * 3));
  const r = 37,
    g = 99,
    b = 235;

  for (let y = 0; y < size; y++) {
    const row = y * (1 + size * 3);
    raw[row] = 0;
    for (let x = 0; x < size; x++) {
      const i = row + 1 + x * 3;
      const cx = size / 2,
        cy = size / 2;
      const dist = Math.hypot(x - cx, y - cy);
      const radius = size * 0.42;
      const corner = size * 0.22;

      let inside =
        x >= corner &&
        x <= size - corner &&
        y >= corner &&
        y <= size - corner;
      inside =
        inside ||
        (x >= corner && x <= size - corner) ||
        (y >= corner && y <= size - corner);
      inside = inside && dist <= radius + corner * 0.3;

      if (inside) {
        raw[i] = r;
        raw[i + 1] = g;
        raw[i + 2] = b;
      } else {
        raw[i] = 239;
        raw[i + 1] = 246;
        raw[i + 2] = 255;
      }
    }
  }

  const compressed = zlib.deflateSync(raw, { level: 9 });
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", compressed),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
}

for (const size of [192, 512, 1024]) {
  const png = createIcon(size);
  if (size === 1024) {
    writeFileSync(join(resDir, "icon.png"), png);
    writeFileSync(join(resDir, "splash.png"), png);
  } else {
    writeFileSync(join(outDir, `icon-${size}.png`), png);
  }
  console.log(`✓ icon-${size}.png`);
}

console.log("✓ resources/icon.png (1024) para Android");
