import sharp from "sharp";
import { mkdir, writeFile, rm } from "node:fs/promises";

const SRC = "assets/photos/ChatGPT Image Aug 2, 2026, 07_35_06 PM.png";
const OUT_DIR = "public/images/name-parts";
const MANIFEST = "src/lib/nameParts.json";

const BLUE = [3, 89, 250];
const PINK = [253, 212, 204];
const INK = [0x17, 0x14, 0x0f];
const ACCENT = [0xb5, 0x65, 0x1d];
const SPLIT_Y = 400;
const STROKE_THRESHOLD = 0.5;
const MIN_HARD_PIXELS = 12; // drop stray anti-alias specks
const PAD = 6;

function dist(a, b) {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

const { data, info } = await sharp(SRC).raw().ensureAlpha().toBuffer({ resolveWithObject: true });
const { width, height } = info;
const n = width * height;

const alpha = new Uint8ClampedArray(n);
const isStroke = new Uint8Array(n);

for (let i = 0; i < n; i++) {
  const idx = i * 4;
  const px = [data[idx], data[idx + 1], data[idx + 2]];
  const dBlue = dist(px, BLUE);
  const dPink = dist(px, PINK);
  const t = dBlue / (dBlue + dPink || 1);
  alpha[i] = Math.max(0, Math.min(255, Math.round(255 * (1 - t) * 1.15)));
  isStroke[i] = t < STROKE_THRESHOLD ? 1 : 0;
}

// connected-component labeling over solid stroke pixels
const label = new Int32Array(n).fill(-1);
const stack = new Int32Array(n);
let numLabels = 0;
const compSumY = [];
const compCount = [];

for (let start = 0; start < n; start++) {
  if (!isStroke[start] || label[start] !== -1) continue;
  const lbl = numLabels++;
  let sp = 0;
  stack[sp++] = start;
  label[start] = lbl;
  let sumY = 0;
  let count = 0;
  while (sp > 0) {
    const p = stack[--sp];
    const x = p % width;
    const y = (p / width) | 0;
    sumY += y;
    count++;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
        const np = ny * width + nx;
        if (isStroke[np] && label[np] === -1) {
          label[np] = lbl;
          stack[sp++] = np;
        }
      }
    }
  }
  compSumY.push(sumY);
  compCount.push(count);
}

const compColor = new Array(numLabels);
for (let l = 0; l < numLabels; l++) {
  const avgY = compSumY[l] / compCount[l];
  compColor[l] = avgY < SPLIT_Y ? INK : ACCENT;
}

// propagate labels into the soft anti-aliased fringe
const queue = new Int32Array(n);
let qh = 0;
let qt = 0;
for (let i = 0; i < n; i++) {
  if (label[i] !== -1) queue[qt++] = i;
}
while (qh < qt) {
  const p = queue[qh++];
  const x = p % width;
  const y = (p / width) | 0;
  const lbl = label[p];
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
      const np = ny * width + nx;
      if (label[np] === -1 && alpha[np] > 0) {
        label[np] = lbl;
        queue[qt++] = np;
      }
    }
  }
}

// recolored full-alpha buffer
const colored = Buffer.from(data);
for (let i = 0; i < n; i++) {
  const idx = i * 4;
  const lbl = label[i];
  const c = lbl >= 0 ? compColor[lbl] : INK;
  colored[idx] = c[0];
  colored[idx + 1] = c[1];
  colored[idx + 2] = c[2];
  colored[idx + 3] = alpha[i];
}

// bounding boxes over ALL labeled pixels (hard + propagated fringe)
const minX = new Array(numLabels).fill(Infinity);
const maxX = new Array(numLabels).fill(-Infinity);
const minY = new Array(numLabels).fill(Infinity);
const maxY = new Array(numLabels).fill(-Infinity);
for (let i = 0; i < n; i++) {
  const lbl = label[i];
  if (lbl < 0) continue;
  const x = i % width;
  const y = (i / width) | 0;
  if (x < minX[lbl]) minX[lbl] = x;
  if (x > maxX[lbl]) maxX[lbl] = x;
  if (y < minY[lbl]) minY[lbl] = y;
  if (y > maxY[lbl]) maxY[lbl] = y;
}

await rm(OUT_DIR, { recursive: true, force: true });
await mkdir(OUT_DIR, { recursive: true });

const fullImage = sharp(colored, { raw: { width, height, channels: 4 } });

const parts = [];
let fileIndex = 0;
for (let l = 0; l < numLabels; l++) {
  if (compCount[l] < MIN_HARD_PIXELS) continue;
  const left = Math.max(0, minX[l] - PAD);
  const top = Math.max(0, minY[l] - PAD);
  const right = Math.min(width, maxX[l] + PAD + 1);
  const bottom = Math.min(height, maxY[l] + PAD + 1);
  const w = right - left;
  const h = bottom - top;

  const fileName = `part-${fileIndex}.png`;
  await fullImage
    .clone()
    .extract({ left, top, width: w, height: h })
    .png()
    .toFile(`${OUT_DIR}/${fileName}`);

  parts.push({
    src: `/images/name-parts/${fileName}`,
    xPct: (left / width) * 100,
    yPct: (top / height) * 100,
    wPct: (w / width) * 100,
    hPct: (h / height) * 100,
    centerXPct: (((left + right) / 2) / width) * 100,
  });
  fileIndex++;
}

parts.sort((a, b) => a.centerXPct - b.centerXPct);

await writeFile(
  MANIFEST,
  JSON.stringify({ canvasWidth: width, canvasHeight: height, parts }, null, 2),
);

console.log(`components: ${numLabels}, exported parts: ${parts.length}`);
console.log("manifest:", MANIFEST);
