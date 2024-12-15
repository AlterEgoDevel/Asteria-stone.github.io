// Получаем ссылки на элементы интерфейса
const balanceDisplay = document.getElementById('balance');
const canvas = document.getElementById('sphereCanvas');
const ctx = canvas.getContext('2d');

// Адаптируем размеры canvas под экран
function resizeCanvas() {
    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * pixelRatio;
    canvas.height = window.innerHeight * pixelRatio;
    ctx.scale(pixelRatio, pixelRatio);

    sphereRadius = Math.min(window.innerWidth, window.innerHeight) / (isMobile ? 5 : 3); // Перерасчет радиуса
}
const isMobile = window.innerWidth <= 768; // Проверяем устройство
let sphereRadius = Math.min(window.innerWidth, window.innerHeight) / (isMobile ? 5 : 3);
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let balance = 0;
const particles = [];
const orbitalParticles = [];
const maxOrbitalParticles = 300;

// Инициализируем баланс из localStorage
const storedBalance = localStorage.getItem('balance');
if (storedBalance && !isNaN(parseInt(storedBalance))) {
    balance = parseInt(storedBalance);
}

balanceDisplay.textContent = balance;

class Particle {
    constructor(x, y, size, alpha, velocity) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.alpha = alpha;
        this.velocity = velocity;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 0, ${this.alpha})`;
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.005;
    }
}

class OrbitalParticle {
    constructor(angle, distance, size, isDim) {
        this.angle = angle;
        this.distance = distance;
        this.size = size;
        this.alpha = 0;
        this.orbitalSpeed = Math.random() * 0.005 + 0.001;
        this.isDetached = false;
        this.isDim = isDim;
    }

    draw() {
        const x = canvas.width / 2 / window.devicePixelRatio + Math.cos(this.angle) * this.distance;
        const y = canvas.height / 2 / window.devicePixelRatio + Math.sin(this.angle) * this.distance * 0.8;

        ctx.beginPath();
        ctx.arc(x, y, this.size, 0, Math.PI * 2);
        const colorAlpha = this.isDim ? this.alpha * 0.5 : this.alpha;
        ctx.fillStyle = `rgba(0, 255, 0, ${colorAlpha})`;
        ctx.fill();
        ctx.closePath();
    }

    update() {
        if (!this.isDetached) {
            this.angle += this.orbitalSpeed;
            if (this.alpha < 1) this.alpha += 0.01;
        } else {
            this.distance += 1;
            this.alpha -= 0.01;
        }
    }
}

function generateOrbitalParticles(count) {
    while (orbitalParticles.length < count) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * sphereRadius;
        const size = Math.random() * 2 + 1;
        const isDim = Math.random() < 0.3;
        orbitalParticles.push(new OrbitalParticle(angle, distance, size, isDim));
    }
}

generateOrbitalParticles(maxOrbitalParticles);

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    orbitalParticles.forEach((particle, index) => {
        particle.update();
        if (particle.alpha <= 0) {
            orbitalParticles.splice(index, 1);
        } else {
            particle.draw();
        }
    });

    if (Math.random() < 0.05) {
        generateOrbitalParticles(maxOrbitalParticles);
    }

    particles.forEach((particle, index) => {
        particle.update();
        if (particle.alpha <= 0) {
            particles.splice(index, 1);
        } else {
            particle.draw();
        }
    });

    requestAnimationFrame(animate);
}

canvas.addEventListener('click', (event) => {
    balance++;
    balanceDisplay.textContent = balance;
    localStorage.setItem('balance', balance);

    const numDetached = Math.floor(Math.random() * 10) + 1;
    let detachedCount = 0;

    orbitalParticles.forEach((particle) => {
        if (!particle.isDetached && detachedCount < numDetached) {
            particle.isDetached = true;
            particle.velocity = {
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2
            };
            detachedCount++;
        }
    });
});

animate();
