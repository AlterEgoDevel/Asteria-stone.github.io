// Получаем ссылки на элементы интерфейса
const balanceDisplay = document.getElementById('balance');
const canvas = document.getElementById('sphereCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let balance = 0;
const particles = [];
const orbitalParticles = [];
const sphereRadius = 300; // Увеличенный радиус сферы
const maxOrbitalParticles = 300;
let rotationSpeed = 0.001; // Уменьшенная скорость вращения

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
        this.alpha -= 0.005; // Более плавное исчезновение
    }
}

class OrbitalParticle {
    constructor(angle, distance, size, isDim) {
        this.angle = angle;
        this.distance = distance;
        this.size = size;
        this.alpha = 0; // Изначально прозрачный
        this.orbitalSpeed = Math.random() * 0.005 + 0.001; // Уменьшена скорость
        this.isDetached = false;
        this.isDim = isDim; // Флаг тусклости
    }

    draw() {
        const x = canvas.width / 2 + Math.cos(this.angle) * this.distance;
        const y = canvas.height / 2 + Math.sin(this.angle) * this.distance * 0.8; // Сжатие по оси Y для наклона

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
            if (this.alpha < 1) this.alpha += 0.01; // Плавное появление
        } else {
            this.distance += 1;
            this.alpha -= 0.01; // Плавное исчезновение
        }
    }
}

function generateOrbitalParticles(count) {
    while (orbitalParticles.length < count) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * sphereRadius;
        const size = Math.random() * 4 + 1; // Увеличен размер частиц
        const isDim = Math.random() < 0.3; // 30% частиц будут тусклыми
        orbitalParticles.push(new OrbitalParticle(angle, distance, size, isDim));
    }
}

generateOrbitalParticles(maxOrbitalParticles);

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Рисуем и обновляем орбитальные частицы
    orbitalParticles.forEach((particle, index) => {
        particle.update();
        if (particle.alpha <= 0) {
            orbitalParticles.splice(index, 1);
        } else {
            particle.draw();
        }
    });

    // Восстанавливаем орбитальные частицы случайным образом
    if (Math.random() < 0.05) {
        generateOrbitalParticles(maxOrbitalParticles);
    }

    // Рисуем и обновляем оторвавшиеся частицы
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
    const clickX = event.clientX;
    const clickY = event.clientY;

    // Увеличение баланса
    balance++;
    balanceDisplay.textContent = balance;
    localStorage.setItem('balance', balance);

    // Удаляем случайную часть орбитальных частиц
    const numDetached = Math.floor(Math.random() * 10) + 1; // От 1 до 10 частиц
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
