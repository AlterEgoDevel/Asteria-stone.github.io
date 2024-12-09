const gameContainer = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('start-button');

let score = 0;
let gameInterval;
let gameDuration = 30000; // 30 секунд
let dangerousIconsCount = 0;
let gameRunning = false; // Для контроля состояния игры

const spawnInterval = 300; // Интервал появления объектов (мс)
const icons = [
    { className: 'danger', points: -100, maxCount: 5 },
    { className: 'bonus1', points: 1 },
    { className: 'bonus5', points: 5 }
];

function startGame() {
    score = 0;
    dangerousIconsCount = 0;
    gameRunning = true;
    scoreDisplay.textContent = score;
    startButton.style.display = 'none';

    // Запускаем генерацию объектов
    gameInterval = setInterval(() => {
        if (gameRunning) spawnIcon();
    }, spawnInterval);

    // Останавливаем игру через 30 секунд
    setTimeout(() => {
        gameRunning = false;
        clearInterval(gameInterval);
        alert(`Игра закончена! Ваши очки: ${score}`);
        startButton.style.display = 'block';
    }, gameDuration);
}

function spawnIcon() {
    // Выбираем тип иконки
    const iconType = Math.random() < 0.2 && dangerousIconsCount < icons[0].maxCount
        ? icons[0]
        : Math.random() < 0.5
        ? icons[1]
        : icons[2];

    if (iconType.className === 'danger') dangerousIconsCount++;

    // Создаём элемент
    const icon = document.createElement('div');
    icon.className = `icon ${iconType.className}`;
    icon.style.left = `${Math.random() * 100}vw`; // Случайное положение по горизонтали
    icon.style.animationDuration = `${5 + Math.random() * 5}s`; // Скорость падения
    icon.style.setProperty('--fall-speed', `${5 + Math.random() * 5}s`);
    icon.style.setProperty('--rotate-speed', `${2 + Math.random() * 3}s`);

    gameContainer.appendChild(icon);

    // Обработка клика
    icon.addEventListener('click', () => {
        score += iconType.points;
        if (score < 0) {
            score = 0; // Устанавливаем минимальный счет равным нулю
        }
        scoreDisplay.textContent = score;
        icon.remove();
    });

    // Удаляем объект по окончании анимации
    icon.addEventListener('animationend', () => icon.remove());
}

startButton.addEventListener('click', startGame);









function spawnStar() {
    const star = document.createElement('div');
    star.className = 'star';

    // Случайное положение
    star.style.left = `${Math.random() * 100}vw`;
    star.style.top = `${Math.random() * 100}vh`;

    // Случайный размер
    const size = Math.random() * 3 + 2; // Размер от 2 до 5px
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;

    gameContainer.appendChild(star);

    // Удаляем звезду после завершения анимации
    star.addEventListener('animationend', () => star.remove());
}

// Вызываем звезды каждые 300 мс
setInterval(spawnStar, 300);

