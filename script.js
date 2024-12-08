const gameContainer = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('start-button');

let score = 0;
let gameInterval;
let gameDuration = 30000; // 30 секунд
let dangerousIconsCount = 0;

const icons = [
    { className: 'danger', points: -100, maxCount: 5 },
    { className: 'bonus1', points: 1 },
    { className: 'bonus5', points: 5 }
];

function startGame() {
    score = 0;
    dangerousIconsCount = 0;
    scoreDisplay.textContent = score;
    startButton.style.display = 'none';

    gameInterval = setInterval(spawnIcon, 500);

    setTimeout(() => {
        clearInterval(gameInterval);
        alert(`Игра закончена! Ваши очки: ${score}`);
        startButton.style.display = 'block';
    }, gameDuration);
}

function spawnIcon() {
    const iconType = Math.random() < 0.2 && dangerousIconsCount < 5
        ? icons[0]
        : Math.random() < 0.5
        ? icons[1]
        : icons[2];

    if (iconType.className === 'danger') dangerousIconsCount++;

    const icon = document.createElement('div');
    icon.className = `icon ${iconType.className}`;
    icon.style.left = `${Math.random() * 100}vw`;
    icon.style.width = `30px`; // Фиксированный размер иконки
    icon.style.height = `30px`;
    icon.style.padding = `20px`; // Увеличенная кликабельная область
    icon.style.animationDuration = `${3 + Math.random() * 2}s, ${2 + Math.random() * 3}s`; // Разная скорость падения и вращения
    icon.style.animationDirection = `normal, ${Math.random() > 0.5 ? 'reverse' : 'normal'}`; // Случайное направление вращения
    icon.style.backgroundImage = `url('images/${iconType.className}.png')`; // Подключаем изображение
    gameContainer.appendChild(icon);

    icon.addEventListener('click', () => {
        score += iconType.points;
        scoreDisplay.textContent = score;
        icon.remove();
    });

    icon.addEventListener('animationend', () => icon.remove());
}



startButton.addEventListener('click', startGame);

function spawnIcon() {
    const iconType = Math.random() < 0.2 && dangerousIconsCount < 5
        ? icons[0]
        : Math.random() < 0.5
        ? icons[1]
        : icons[2];

    if (iconType.className === 'danger') dangerousIconsCount++;

    const icon = document.createElement('div'); // Используем <div>
    icon.className = `icon ${iconType.className}`;
    icon.style.left = `${Math.random() * 100}vw`;
    icon.style.width = `${10 + Math.random() * 20}px`; // Рандомный размер
    icon.style.height = icon.style.width; // Делаем элемент квадратным
    gameContainer.appendChild(icon);

    icon.addEventListener('click', () => {
        score += iconType.points;
        scoreDisplay.textContent = score;
        icon.remove();
    });

    icon.addEventListener('animationend', () => icon.remove());

    const duration = 3 + Math.random() * 2; // 3-5 секунд падения
    icon.style.animationDuration = `${duration}s`;
}
