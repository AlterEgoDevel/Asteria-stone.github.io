// Получаем ссылки на элементы интерфейса
const balanceDisplay = document.getElementById('balance'); // Элемент для отображения баланса
const canvas = document.getElementById('sphereCanvas'); // Элемент <canvas> для рисования
const ctx = canvas.getContext('2d'); // Контекст 2D для отрисовки графики

// Флаг для проверки мобильного устройства
const isMobile = window.innerWidth <= 768; // Если ширина экрана меньше или равна 768px, считаем устройство мобильным

// Радиус сферы, в зависимости от устройства
let sphereRadius = Math.min(window.innerWidth, window.innerHeight) / (isMobile ? 3.5 : 2.5);

// Функция для адаптации размеров канваса под экран
function resizeCanvas() {
    const pixelRatio = window.devicePixelRatio || 1; // Учет плотности пикселей (например, для Retina экранов)
    const size = Math.min(window.innerWidth, window.innerHeight) * 0.8; // Ограничение размера канваса 80% от меньшей стороны экрана

    // Устанавливаем ширину и высоту канваса с учетом плотности пикселей
    canvas.width = size * pixelRatio; 
    canvas.height = size * pixelRatio;

    // Масштабируем контекст для улучшения качества изображения на экранах с высокой плотностью пикселей
    ctx.scale(pixelRatio, pixelRatio); 

    // Пересчитываем радиус сферы в зависимости от нового размера канваса
    sphereRadius = size / 2.5;
}

// Инициализация размера канваса при загрузке
resizeCanvas();

// Обновляем размеры канваса при изменении размера окна
window.addEventListener('resize', resizeCanvas);

let balance = 0; // Текущий баланс пользователя
const particles = []; // Массив для хранения оторвавшихся частиц
const orbitalParticles = []; // Массив для хранения орбитальных частиц
const maxOrbitalParticles = 300; // Максимальное количество орбитальных частиц

// Инициализация баланса из localStorage
const storedBalance = localStorage.getItem('balance'); // Получаем сохраненный баланс
if (storedBalance && !isNaN(parseInt(storedBalance))) {
    balance = parseInt(storedBalance); // Устанавливаем сохраненный баланс
}

// Отображаем текущий баланс на экране
balanceDisplay.textContent = balance; 

// Класс для оторвавшихся частиц
class Particle {
    constructor(x, y, size, alpha, velocity) {
        this.x = x; // Координата X
        this.y = y; // Координата Y
        this.size = size; // Размер частицы
        this.alpha = alpha; // Прозрачность частицы
        this.velocity = velocity; // Скорость частицы
    }

    // Метод для отрисовки частицы
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); // Рисуем круг
        ctx.fillStyle = `rgba(0, 255, 0, ${this.alpha})`; // Цвет с учетом прозрачности
        ctx.fill();
        ctx.closePath();
    }

    // Метод для обновления положения частицы
    update() {
        this.x += this.velocity.x; // Обновляем координату X
        this.y += this.velocity.y; // Обновляем координату Y
        this.alpha -= 0.005; // Постепенно уменьшаем прозрачность
    }
}

// Класс для орбитальных частиц
class OrbitalParticle {
    constructor(angle, distance, size, isDim) {
        this.angle = angle; // Угол на орбите
        this.distance = distance; // Расстояние от центра
        this.size = size; // Размер частицы
        this.alpha = 0; // Начальная прозрачность
        this.orbitalSpeed = Math.random() * 0.005 + 0.001; // Скорость вращения
        this.isDetached = false; // Флаг оторвавшейся частицы
        this.isDim = isDim; // Тусклость частицы
    }

    // Метод для отрисовки орбитальной частицы
    draw() {
        const x = canvas.width / 2 / (window.devicePixelRatio || 1) + Math.cos(this.angle) * this.distance; // Вычисляем позицию по оси X
        const y = canvas.height / 2 / (window.devicePixelRatio || 1) + Math.sin(this.angle) * this.distance; // Вычисляем позицию по оси Y

        ctx.beginPath();
        ctx.arc(x, y, this.size, 0, Math.PI * 2); // Рисуем орбитальную частицу
        const colorAlpha = this.isDim ? this.alpha * 0.5 : this.alpha; // Учет тусклости
        ctx.fillStyle = `rgba(0, 255, 0, ${colorAlpha})`; // Цвет с учетом прозрачности
        ctx.fill();
        ctx.closePath();
    }

    // Метод для обновления состояния орбитальной частицы
    update() {
        if (!this.isDetached) {
            this.angle += this.orbitalSpeed; // Увеличиваем угол для вращения
            if (this.alpha < 1) this.alpha += 0.01; // Постепенно увеличиваем прозрачность
        } else {
            this.distance += 1; // Увеличиваем расстояние от центра, если частица оторвалась
            this.alpha -= 0.01; // Уменьшаем прозрачность
        }
    }
}

// Функция для генерации орбитальных частиц
function generateOrbitalParticles(count) {
    while (orbitalParticles.length < count) {
        const angle = Math.random() * Math.PI * 2; // Случайный угол
        const distance = Math.random() * sphereRadius; // Случайное расстояние от центра
        const size = Math.random() * 2 + 1; // Случайный размер
        const isDim = Math.random() < 0.3; // 30% частиц тусклые
        orbitalParticles.push(new OrbitalParticle(angle, distance, size, isDim)); // Добавляем частицу в массив
    }
}

generateOrbitalParticles(maxOrbitalParticles); // Генерация начальных частиц

// Основная анимация
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаем канвас

    orbitalParticles.forEach((particle, index) => {
        particle.update(); // Обновляем положение орбитальной частицы
        if (particle.alpha <= 0) { // Если частица стала невидимой, удаляем ее
            orbitalParticles.splice(index, 1);
        } else {
            particle.draw(); // Рисуем частицу
        }
    });

    if (Math.random() < 0.05) {
        generateOrbitalParticles(maxOrbitalParticles); // Иногда генерируем новые частицы
    }

    particles.forEach((particle, index) => {
        particle.update(); // Обновляем положение оторвавшейся частицы
        if (particle.alpha <= 0) { // Если частица стала невидимой, удаляем ее
            particles.splice(index, 1);
        } else {
            particle.draw(); // Рисуем оторвавшуюся частицу
        }
    });

    requestAnimationFrame(animate); // Рекурсивно вызываем анимацию
}

// Обработка кликов по канвасу
canvas.addEventListener('click', (event) => {
    balance++; // Увеличиваем баланс
    balanceDisplay.textContent = balance; // Отображаем обновленный баланс
    localStorage.setItem('balance', balance); // Сохраняем баланс в localStorage

    const numDetached = Math.floor(Math.random() * 10) + 1; // Количество оторвавшихся частиц
    let detachedCount = 0;

    orbitalParticles.forEach((particle) => {
        if (!particle.isDetached && detachedCount < numDetached) {
            particle.isDetached = true; // Отмечаем частицу как оторвавшуюся
            particle.velocity = { // Случайная скорость для оторвавшейся частицы
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2
            };
            detachedCount++;
        }
    });
});

// Запуск анимации
animate();
