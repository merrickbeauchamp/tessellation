const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let position = { x: 0, y: 0 };
const setPosition = (e) => {
  let rect = canvas.getBoundingClientRect();
  position.x =
    ((e.clientX - rect.left) / (rect.right - rect.left)) * canvas.width;
  position.y =
    ((e.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height;
};
let lines = []; //{startX, startY, endX, endY}

canvas.addEventListener("mousedown", setPosition);
canvas.addEventListener("mouseenter", setPosition);
canvas.addEventListener("mousemove", (e) => {
  if (e.buttons !== 1) return;
  let line = {};
  ctx.beginPath();
  ctx.moveTo(position.x, position.y);
  line.startX = position.x;
  line.startY = position.y;
  setPosition(e);
  ctx.lineTo(position.x, position.y);
  line.endX = position.x;
  line.endY = position.y;
  ctx.stroke();
  lines.push(line);
});

document.getElementById("clear").addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  lines = [];
});

const final = document.getElementById("final");
const finalCtx = final.getContext("2d");
final.width = document.documentElement.clientWidth;
final.height = document.documentElement.clientHeight;
const draw = (verticalLine, horizontalLine) => {
  let closeY = final.width;
  for (const line of horizontalLine) {
    if (line.startY < closeY) closeY = line.startY;
    if (line.endY < closeY) closeY = line.endY;
  }
  for (let i = 0; i < finalCtx.canvas.width; i += canvas.width) {
    for (let j = 0; j < finalCtx.canvas.height; j += canvas.height) {
      finalCtx.translate(i, j);
      finalCtx.beginPath();
      for (const line of horizontalLine) {
        finalCtx.moveTo(line.startX, line.startY - closeY);
        finalCtx.lineTo(line.endX, line.endY - closeY);
      }
      for (const line of verticalLine) {
        finalCtx.moveTo(line.startX - canvas.width / 2, line.startY);
        finalCtx.lineTo(line.endX - canvas.width / 2, line.endY);
      }
      finalCtx.stroke();
      finalCtx.translate(-i, -j);
    }
  }
};

let verticalLine = [];
let horizontalLine = [];
let phase = 1;
const text = document.getElementById("text");
const reset = document.getElementById("reset");

document.getElementById("submit").addEventListener("click", () => {
  if (phase == 1) {
    if (lines.length == 0) return;
    verticalLine = lines;
    lines = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    text.innerHTML = "Draw a horizontal line in the box. -";
    phase++;
  }
  if (phase == 2) {
    if (lines.length == 0) return;
    horizontalLine = lines;
    lines = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw(verticalLine, horizontalLine);
    document.getElementById("draw").style.display = "none";
    reset.style.display = "block";
  }
});

reset.addEventListener("click", () => {
  phase = 1;
  text.innerHTML = "Draw a vertical line in the box. |";
  document.getElementById("draw").style.display = "block";
  finalCtx.clearRect(0, 0, final.width, final.height);
  reset.style.display = "none";
});
