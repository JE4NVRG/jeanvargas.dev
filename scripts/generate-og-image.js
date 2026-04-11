const { createCanvas } = require("canvas");
const fs = require("fs");
const path = require("path");

const WIDTH = 1200;
const HEIGHT = 630;

const canvas = createCanvas(WIDTH, HEIGHT);
const ctx = canvas.getContext("2d");

// Background gradient
const bgGrad = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
bgGrad.addColorStop(0, "#050505");
bgGrad.addColorStop(1, "#1a1a2e");
ctx.fillStyle = bgGrad;
ctx.fillRect(0, 0, WIDTH, HEIGHT);

// Subtle grid lines
ctx.strokeStyle = "rgba(255,255,255,0.02)";
ctx.lineWidth = 1;
const gridSize = 60;
for (let x = 0; x <= WIDTH; x += gridSize) {
  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x, HEIGHT);
  ctx.stroke();
}
for (let y = 0; y <= HEIGHT; y += gridSize) {
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(WIDTH, y);
  ctx.stroke();
}

// Purple orb top-left
const purpleGrad = ctx.createRadialGradient(200, 150, 0, 200, 150, 350);
purpleGrad.addColorStop(0, "rgba(139, 92, 246, 0.15)");
purpleGrad.addColorStop(1, "rgba(139, 92, 246, 0)");
ctx.fillStyle = purpleGrad;
ctx.fillRect(0, 0, WIDTH, HEIGHT);

// Cyan orb bottom-right
const cyanGrad = ctx.createRadialGradient(1000, 480, 0, 1000, 480, 350);
cyanGrad.addColorStop(0, "rgba(6, 182, 212, 0.1)");
cyanGrad.addColorStop(1, "rgba(6, 182, 212, 0)");
ctx.fillStyle = cyanGrad;
ctx.fillRect(0, 0, WIDTH, HEIGHT);

// Main text "je4ndev"
ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.fillStyle = "#ffffff";
ctx.font = "bold 72px sans-serif";
ctx.fillText("je4ndev", WIDTH / 2, HEIGHT / 2 - 30);

// Subtitle
ctx.fillStyle = "#a1a1aa"; // zinc-400
ctx.font = "24px sans-serif";
ctx.fillText("Full Stack Developer & SaaS Builder", WIDTH / 2, HEIGHT / 2 + 40);

// Bottom URL
ctx.fillStyle = "#52525b"; // zinc-600
ctx.font = "16px sans-serif";
ctx.fillText("je4ndev.com", WIDTH / 2, HEIGHT - 40);

// Save
const outPath = path.join(__dirname, "..", "public", "og-image.png");
const buffer = canvas.toBuffer("image/png");
fs.writeFileSync(outPath, buffer);
console.log("OG image saved to", outPath);
