//------------- Fonctions utiles -------------

// Fonction générant des nombres pseudo-aléatoires entiers
// entre 0 et max (max non compris)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Fonction générant une couleur aléatoire
function getRandomColor() {
  const red = Math.floor(Math.random() * 256);
  const blue = Math.floor(Math.random() * 256);
  const green = Math.floor(Math.random() * 256);
  return "rgb(" + red + "," + green + "," + blue + ")";
}

//------------- Votre code ici -------------

const canvas = document.getElementById("mobiles");
const ctx = canvas.getContext("2d");

/*
ctx.fillStyle = "green";
ctx.fillRect(10, 10, 150, 100);
*/

class Mobile {
  constructor(ctx, x, y, vx, vy, radius) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.radius = radius;
    this.color = getRandomColor();
  }
  draw() {
    this.ctx.fillStyle = this.color;
    //this.ctx.fillRect(this.x, this.y, this.radius, this.radius);
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.ctx.fill();
  }
  move() {
    this.x += this.vx;
    this.y += this.vy;
    this.x = this.x % this.ctx.canvas.clientWidth;
    this.y = this.y % this.ctx.canvas.clientHeight;
    this.ctx.clearRect(
      0,
      0,
      this.ctx.canvas.clientWidth,
      this.ctx.canvas.clientWidth
    );
  }
  moveInBox() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x + this.radius >= this.ctx.canvas.clientWidth) {
      this.vx = -this.vx;
    }

    if (this.x - this.radius < 0) {
      this.vx = -this.vx;
    }

    if (this.y + this.radius >= this.ctx.canvas.clientHeight) {
      this.y = this.ctx.canvas.clientHeight - this.radius;

      this.vy = -this.vy;
    }

    if (this.y < 0) {
      this.vy = -this.vy;
    }
    this.vy *= 0.99;
    this.vx *= 0.99;

    this.vy += 0.25;
  }
}

const mob1 = new Mobile(ctx, 100, 100, 3, 0, 10);
const mob2 = new Mobile(ctx, 130, 300, 5, 0, 20);
const mob3 = new Mobile(ctx, 320, 150, 9, 3, 30);

function anim() {
  mob1.move();
  mob2.move();
  mob3.move();
  mob1.draw();
  mob2.draw();
  mob3.draw();
}

const buttonMob1 = document.getElementById("mob1");
buttonMob1.addEventListener("click", function () {
  mob1.draw();
});

const buttonMob2 = document.getElementById("mob2");
buttonMob2.addEventListener("click", function () {
  mob2.draw();
});

const buttonMob3 = document.getElementById("mob3");
buttonMob3.addEventListener("click", function () {
  mob3.draw();
});

const buttonMove = document.getElementById("move");
buttonMove.addEventListener("click", function () {
  anim();
});

const buttonAnim = document.getElementById("anim");
buttonAnim.addEventListener("click", function () {
  if (buttonAnim.innerText == "Animer") {
    startRAF();
    buttonAnim.innerText = "Arrêter";
  } else {
    stopRAF();
    buttonAnim.innerText = "Animer";
  }
});

function anim() {
  ctx.clearRect(0, 0, 400, 400);
  mob1.move();
  mob2.move();
  mob3.move();
  mob1.draw();
  mob2.draw();
  mob3.draw();
}

function animInBox() {
  ctx.clearRect(0, 0, 400, 400);
  mob1.draw();
  mob2.draw();
  mob3.draw();
  mob1.moveInBox();
  mob2.moveInBox();
  mob3.moveInBox();
}

let animationTimer = 0;
let starttime = 0;

const maxfps = 60;
const interval = 1000 / maxfps;

function startRAF(timestamp = 0) {
  animationTimer = requestAnimationFrame(startRAF);
  if (starttime === 0) starttime = timestamp;
  let delta = timestamp - starttime;
  if (delta >= interval) {
    //anim();
    animInBox();
    starttime = timestamp - (delta % interval);
  }
}

function stopRAF() {
  cancelAnimationFrame(animationTimer);
  animationTimer = 0;
}

class MobileBox {
  constructor(ctxMobile, xMin, yMin, xMax, yMax, monTab) {
    this.ctxMobile = ctxMobile;
    this.xMin = xMin;
    this.yMin = yMin;
    this.xMax = xMax;
    this.yMax = yMax;
    this.monTab = monTab;

    ctxMobile.canvas.width = xMax - xMin;
    ctxMobile.canvas.height = yMax - yMin;
    ctxMobile.canvas.setAttribute(
      "style",
      "position: absolute; left: " + xMin + "px; top: " + yMin + "px;"
    );
  }

  clearbox() {
    monTab.splice(0, monTab.length);
  }

  fillBox(n) {
    //clearbox();

    for (let i = 0; i < n; i++) {
      const vx = getRandomInt(1, 10);
      const vy = getRandomInt(1, 10);
      const radius = getRandomInt(10, 50);
      const x = getRandomInt(radius, this.xMax - this.xMin - radius);
      const y = getRandomInt(radius, this.yMax - this.yMin - radius);
      const mob = new Mobile(this.ctxMobile, x, y, vx, vy, radius);
      this.monTab.push(mob);
    }
  }

  anim() {
    for (let i = 0; i < this.monTab.length; i++) {
      // this.monTab[i].moveInBox();
      this.monTab[i].draw();
    }
  }
}

const canvasMobile = document.getElementById("mobilesBox");
const ctxMobile = canvasMobile.getContext("2d");

const mobileBox = new MobileBox(ctxMobile, 300, 650, 1220, 1100, []);

const buttonFill = document.getElementById("remplir");
buttonFill.addEventListener("click", function () {
  mobileBox.fillBox(document.getElementById("number").value);
  for (let i = 0; i < mobileBox.monTab.length; i++) {
    mobileBox.monTab[i].draw();
  }
});

// Animation

let animationTimerBox = 0;
let starttimeBox = 0;
function startRAFBox(timestamp = 0) {
  animationTimerBox = requestAnimationFrame(startRAFBox);
  if (starttimeBox === 0) starttimeBox = timestamp;
  let delta = timestamp - starttimeBox;
  if (delta >= interval) {
    //anim();
    animInBoxMobile();
    starttimeBox = timestamp - (delta % interval);
  }
}

function stopRAFBox() {
  cancelAnimationFrame(animationTimerBox);
  animationTimerBox = 0;
}

const buttonStart = document.getElementById("animBox");
buttonStart.addEventListener("click", function () {
  if (buttonStart.innerText == "Animer") {
    startRAFBox();
    buttonStart.innerText = "Arrêter";
  } else {
    stopRAFBox();
    buttonStart.innerText = "Animer";
  }
});

function animInBoxMobile() {
  ctxMobile.clearRect(0, 0, mobileBox.xMax, mobileBox.yMax);
  for (let i = 0; i < mobileBox.monTab.length; i++) {
    mobileBox.monTab[i].moveInBox();
    mobileBox.monTab[i].draw();
  }
}
