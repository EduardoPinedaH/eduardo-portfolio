import sharp from "sharp";

const SRC = "assets/photos/ChatGPT Image Aug 2, 2026, 07_35_06 PM.png";
const OUT = "public/images/name-mark.png";

const BLUE = [3, 89, 250];
const PINK = [253, 212, 204];
const INK = [0x17, 0x14, 0x0f];
const ACCENT = [0xb5, 0x65, 0x1d];
const SPLIT_Y = 400;
const STROKE_THRESHOLD = 0.5; // t < this => solid stroke pixel

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

// 1) connected-component labeling (8-connectivity) over solid stroke pixels
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

// 2) multi-source BFS to propagate each component's label into its soft
// anti-aliased fringe (alpha > 0 but below the solid-stroke threshold)
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

const out = Buffer.from(data);
for (let i = 0; i < n; i++) {
  const idx = i * 4;
  const lbl = label[i];
  const c = lbl >= 0 ? compColor[lbl] : INK;
  out[idx] = c[0];
  out[idx + 1] = c[1];
  out[idx + 2] = c[2];
  out[idx + 3] = alpha[i];
}

console.log("components:", numLabels);

await sharp(out, { raw: { width, height, channels: 4 } }).png().toFile(OUT);

console.log("done", OUT);
