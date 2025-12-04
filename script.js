// Const = è una dichiarazione di variabile //
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Imposta il canvas alla dimensione della finestra
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Si ridimensiona automaticamente
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// === PARTICELLE ===
const particlesArray = [];
const numParticles = 200;

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = 2;
    this.speedX = (Math.random() - 0.5) * 1.5;
    this.speedY = (Math.random() - 0.5) * 1.5;
  }

  move() {
    this.x += this.speedX;
    this.y += this.speedY;

    // Rimbalza ai bordi
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = "#00bcd4";
    ctx.fill();
  }
}

// Crea particelle iniziali
for (let i = 0; i < numParticles; i++) {
  particlesArray.push(new Particle());
}

// === CONNESSIONI TRA PARTICELLE ===
function connectParticles() {
  for (let a = 0; a < particlesArray.length; a++) {
    for (let b = a; b < particlesArray.length; b++) {
      const dx = particlesArray[a].x - particlesArray[b].x;
      const dy = particlesArray[a].y - particlesArray[b].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 120) {
        ctx.strokeStyle = `rgba(0, 188, 212, ${1 - distance / 120})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
        ctx.stroke();
      }
    }
  }
}

// === INTERAZIONE CON IL MOUSE / DITO ===
const mouse = { x: null, y: null };

window.addEventListener("mousemove", e => {
  mouse.x = e.x;
  mouse.y = e.y;
});

window.addEventListener("touchmove", e => {
  mouse.x = e.touches[0].clientX;
  mouse.y = e.touches[0].clientY;
});

window.addEventListener("mouseleave", () => {
  mouse.x = null;
  mouse.y = null;
});

function connectMouse() {
  if (!mouse.x) return;

  for (let i = 0; i < particlesArray.length; i++) {
    const dx = mouse.x - particlesArray[i].x;
    const dy = mouse.y - particlesArray[i].y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 150) {
      ctx.strokeStyle = `rgba(255,255,255,${1 - distance / 150})`;
      ctx.beginPath();
      ctx.moveTo(mouse.x, mouse.y);
      ctx.lineTo(particlesArray[i].x, particlesArray[i].y);
      ctx.stroke();
    }
  }
}

// === ANIMAZIONE ===
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].move();
    particlesArray[i].draw();
  }

  connectParticles();
  connectMouse();

  requestAnimationFrame(animate);
}

animate();
