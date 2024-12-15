// Получаем ссылки на элементы интерфейса
const balanceDisplay = document.getElementById('balance'); // Элемент для отображения баланса
const canvas = document.getElementById('sphereCanvas'); // Элемент <canvas> для рисования
const ctx = canvas.getContext('2d'); // Контекст 2D для отрисовки графики

// Адаптируем размеры canvas под экран
function resizeCanvas() {
    const pixelRatio = window.devicePixelRatio || 1; // Учет плотности пикселей экрана (например, Retina)
    canvas.width = window.innerWidth * pixelRatio; // Ширина canvas в пикселях
    canvas.height = window.innerHeight * pixelRatio; // Высота canvas в пикселях
    ctx.scale(pixelRatio, pixelRatio); // Масштабируем контекст для обеспечения четкости

    // Перерасчет радиуса сферы в зависимости от устройства (мобильное/компьютер)
    sphereRadius = Math.min(window.innerWidth, window.innerHeight) / (isMobile ? 5 : 3);
}

// Определяем, мобильное ли устройство
const isMobile = window.innerWidth <= 768; // Если ширина экрана <= 768px, считаем устройство мобильным
let sphereRadius = Math.min(window.innerWidth, window.innerHeight) / (isMobile ? 5 : 3); // Радиус сферы
resizeCanvas(); // Инициализируем canvas
window.addEventListener('resize', resizeCanvas); // Перерасчет размеров при изменении окна

let balance = 0; // Текущий баланс пользователя
const particles = []; // Массив для хранения оторвавшихся частиц
const orbitalParticles = []; // Массив для хранения орбитальных частиц
const maxOrbitalParticles = 300; // Максимальное количество орбитальных частиц

// Инициализируем баланс из localStorage
const storedBalance = localStorage.getItem('balance'); // Получаем сохраненный баланс
if (storedBalance && !isNaN(parseInt(storedBalance))) {
    balance = parseInt(storedBalance); // Устанавливаем баланс, если он есть в localStorage
}
balanceDisplay.textContent = balance; // Отображаем баланс на странице

// Класс для оторвавшихся частиц
class Particle {
    constructor(x, y, size, alpha, velocity) {
        this.x = x; // Координата X частицы
        this.y = y; // Координата Y частицы
        this.size = size; // Размер частицы
        this.alpha = alpha; // Прозрачность частицы
        this.velocity = velocity; // Скорость движения частицы
    }

    draw() {
        ctx.beginPath(); // Начинаем рисовать
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); // Рисуем круг (частицу)
        ctx.fillStyle = `rgba(0, 255, 0, ${this.alpha})`; // Задаем цвет (зеленый с учетом прозрачности)
        ctx.fill(); // Заполняем круг
        ctx.closePath(); // Завершаем рисование
    }

    update() {
        this.x += this.velocity.x; // Изменяем X координату по скорости
        this.y += this.velocity.y; // Изменяем Y координату по скорости
        this.alpha -= 0.005; // Уменьшаем прозрачность (частица "угасает")
    }
}

// Класс для орбитальных частиц
class OrbitalParticle {
    constructor(angle, distance, size, isDim) {
        this.angle = angle; // Угол вращения частицы
        this.distance = distance; // Расстояние частицы от центра сферы
        this.size = size; // Размер частицы
        this.alpha = 0; // Начальная прозрачность частицы
        this.orbitalSpeed = Math.random() * 0.005 + 0.001; // Скорость вращения частицы
        this.isDetached = false; // Флаг, оторвалась ли частица
        this.isDim = isDim; // Флаг, тусклая ли частица
    }

    draw() {
        // Вычисляем положение частицы в орбите
        const x = canvas.width / 2 / window.devicePixelRatio + Math.cos(this.angle) * this.distance;
        const y = canvas.height / 2 / window.devicePixelRatio + Math.sin(this.angle) * this.distance * 0.8; // Сжатие по оси Y

        ctx.beginPath(); // Начинаем рисовать
        ctx.arc(x, y, this.size, 0, Math.PI * 2); // Рисуем круг (частицу)
        const colorAlpha = this.isDim ? this.alpha * 0.5 : this.alpha; // Учет тусклости
        ctx.fillStyle = `rgba(0, 255, 0, ${colorAlpha})`; // Задаем цвет (зеленый с учетом прозрачности)
        ctx.fill(); // Заполняем круг
        ctx.closePath(); // Завершаем рисование
    }

    update() {
        if (!this.isDetached) { // Если частица на орбите
            this.angle += this.orbitalSpeed; // Увеличиваем угол вращения
            if (this.alpha < 1) this.alpha += 0.01; // Постепенно увеличиваем прозрачность
        } else { // Если частица оторвалась
            this.distance += 1; // Увеличиваем расстояние от центра
            this.alpha -= 0.01; // Уменьшаем прозрачность
        }
    }
}

// Генерация орбитальных частиц
function generateOrbitalParticles(count) {
    while (orbitalParticles.length < count) {
        const angle = Math.random() * Math.PI * 2; // Случайный угол
        const distance = Math.random() * sphereRadius; // Случайное расстояние от центра
        const size = Math.random() * 2 + 1; // Случайный размер частицы
        const isDim = Math.random() < 0.3; // 30% частиц тусклые
        orbitalParticles.push(new OrbitalParticle(angle, distance, size, isDim)); // Добавляем частицу
    }
}

generateOrbitalParticles(maxOrbitalParticles); // Генерируем частицы при старте

// Основная анимация
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаем canvas

    // Обновляем и рисуем орбитальные частицы
    orbitalParticles.forEach((particle, index) => {
        particle.update();
        if (particle.alpha <= 0) { // Удаляем угасшие частицы
            orbitalParticles.splice(index, 1);
        } else {
            particle.draw();
        }
    });

    // Случайное добавление новых орбитальных частиц
    if (Math.random() < 0.05) {
        generateOrbitalParticles(maxOrbitalParticles);
    }

    // Обновляем и рисуем оторвавшиеся частицы
    particles.forEach((particle, index) => {
        particle.update();
        if (particle.alpha <= 0) { // Удаляем угасшие частицы
            particles.splice(index, 1);
        } else {
            particle.draw();
        }
    });

    requestAnimationFrame(animate); // Рекурсивно запускаем анимацию
}

// Обработка кликов по canvas
canvas.addEventListener('click', (event) => {
    balance++; // Увеличиваем баланс
    balanceDisplay.textContent = balance; // Отображаем обновленный баланс
    localStorage.setItem('balance', balance); // Сохраняем баланс в localStorage

    const numDetached = Math.floor(Math.random() * 10) + 1; // Количество отрывающихся частиц
    let detachedCount = 0;

    // Отрываем случайные частицы
    orbitalParticles.forEach((particle) => {
        if (!particle.isDetached && detachedCount < numDetached) {
            particle.isDetached = true; // Отмечаем частицу как оторвавшуюся
            particle.velocity = { // Задаем случайную скорость
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2
            };
            detachedCount++;
        }
    });
});

animate(); // Запускаем анимацию
