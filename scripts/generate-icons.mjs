// Script de génération des icônes PWA à partir du favicon SVG
import sharp from "sharp";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const svgPath = resolve(__dirname, "../public/favicon.svg");
const svg = readFileSync(svgPath);

const sizes = [72, 96, 128, 144, 192, 384, 512];

for (const size of sizes) {
  await sharp(svg)
    .resize(size, size)
    .png()
    .toFile(resolve(__dirname, `../public/icons/icon-${size}x${size}.png`));
  console.log(`✓ icon-${size}x${size}.png`);
}

// Apple touch icon (180x180)
await sharp(svg)
  .resize(180, 180)
  .png()
  .toFile(resolve(__dirname, "../public/icons/apple-touch-icon.png"));
console.log("✓ apple-touch-icon.png");

// Maskable icon (512x512 avec padding pour safe zone)
// La safe zone maskable est un cercle inscrit = 80% de la taille
const maskableSize = 512;
const padding = Math.round(maskableSize * 0.1); // 10% padding de chaque côté
const innerSize = maskableSize - padding * 2;

await sharp(svg)
  .resize(innerSize, innerSize)
  .extend({
    top: padding,
    bottom: padding,
    left: padding,
    right: padding,
    background: "#1a5fc0",
  })
  .png()
  .toFile(resolve(__dirname, "../public/icons/maskable-icon-512x512.png"));
console.log("✓ maskable-icon-512x512.png");

console.log("\nToutes les icônes ont été générées !");
