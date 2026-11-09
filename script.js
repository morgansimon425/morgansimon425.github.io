// ---------- twinkling light strand across the top ----------
const BULB_COLORS = ["#E5484D", "#F5C451", "#4FA36B", "#8CC8F0", "#F28DB2"];

function buildLights() {
  const el = document.getElementById("lights");
  const w = el.clientWidth;
  const px = 4, sag = 20, top = 4;
  const swags = Math.max(2, Math.round(w / 240));
  const swagW = w / swags;
  const wireY = (x) => top + Math.round((sag * Math.sin(Math.PI * ((x % swagW) / swagW))) / px) * px;

  let out = "";
  for (let x = 0; x < w; x += px) {
    out += `<rect x="${x}" y="${wireY(x)}" width="${px}" height="${px}" fill="#7C8F80"/>`;
  }
  let i = 0;
  for (let x = 18; x < w - 8; x += 36, i++) {
    const bx = Math.round(x / px) * px;
    const y = wireY(bx) + px;
    const c = BULB_COLORS[i % BULB_COLORS.length];
    const s = `style="--d:${(1.4 + Math.random() * 1.8).toFixed(1)}s;--o:-${(Math.random() * 3).toFixed(1)}s"`;
    out +=
      `<circle class="glow" cx="${bx + px}" cy="${y + px * 3}" r="${px * 3}" fill="${c}" opacity=".3" ${s}/>` +
      `<rect x="${bx}" y="${y}" width="${px * 2}" height="${px}" fill="#4B5A50"/>` +
      `<rect class="bulb" x="${bx}" y="${y + px}" width="${px * 2}" height="${px * 3}" fill="${c}" ${s}/>` +
      `<rect x="${bx}" y="${y + px}" width="${px}" height="${px}" fill="#fff" opacity=".6"/>`;
  }
  el.innerHTML = `<svg width="${w}" height="56" shape-rendering="crispEdges">${out}</svg>`;
}

// ---------- pixel snow over the whole page ----------
const canvas = document.getElementById("snow");
const ctx = canvas.getContext("2d");
const P = 3; // size of one snow "pixel"
let flakes = [];
let running = false;
let frame = null;

function resizeSnow() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const count = Math.min(110, Math.round((innerWidth * innerHeight) / 14000));
  flakes = Array.from({ length: count }, () => newFlake(true));
}

function newFlake(anywhere) {
  return {
    x: Math.random() * innerWidth,
    y: anywhere ? Math.random() * innerHeight : -10,
    big: Math.random() < 0.3,
    vy: 0.35 + Math.random() * 0.6,
    phase: Math.random() * Math.PI * 2,
  };
}

function drawFlake(f) {
  const x = Math.round(f.x / P) * P;
  const y = Math.round(f.y / P) * P;
  if (f.big) {
    // little plus-shaped flake: blue arms, white center (visible on light backgrounds)
    ctx.fillStyle = "#B9D3EE";
    ctx.fillRect(x - P, y, P * 3, P);
    ctx.fillRect(x, y - P, P, P * 3);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(x, y, P, P);
  } else {
    ctx.fillStyle = "#C8DCF1";
    ctx.fillRect(x, y, P, P);
  }
}

function tick() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  for (const f of flakes) {
    f.y += f.vy;
    f.phase += 0.01;
    f.x += Math.sin(f.phase) * 0.3;
    if (f.y > innerHeight + 10) Object.assign(f, newFlake(false));
    drawFlake(f);
  }
  frame = requestAnimationFrame(tick);
}

function setSnow(on) {
  document.body.classList.toggle("calm", !on);
  if (on && !running) {
    running = true;
    tick();
  } else if (!on && running) {
    running = false;
    cancelAnimationFrame(frame);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
  }
}

// ---------- toggle: remembers the choice, defaults off for reduced motion ----------
const toggle = document.getElementById("snow-toggle");
let saved = null;
try { saved = localStorage.getItem("snow"); } catch (e) {}
const prefersCalm = matchMedia("(prefers-reduced-motion: reduce)").matches;
toggle.checked = saved ? saved === "on" : !prefersCalm;

toggle.addEventListener("change", () => {
  try { localStorage.setItem("snow", toggle.checked ? "on" : "off"); } catch (e) {}
  setSnow(toggle.checked);
});

buildLights();
resizeSnow();
setSnow(toggle.checked);

let resizeTimer;
addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => { buildLights(); resizeSnow(); }, 150);
});

// ---------- dark mode: follows the system until the visitor picks ----------
const themeToggle = document.getElementById("theme-toggle");
const systemDark = matchMedia("(prefers-color-scheme: dark)");
const currentTheme = () => document.documentElement.dataset.theme || (systemDark.matches ? "dark" : "light");
themeToggle.checked = currentTheme() === "dark";

themeToggle.addEventListener("change", () => {
  const t = themeToggle.checked ? "dark" : "light";
  document.documentElement.dataset.theme = t;
  try { localStorage.setItem("theme", t); } catch (e) {}
});
systemDark.addEventListener("change", () => { themeToggle.checked = currentTheme() === "dark"; });
