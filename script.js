const gameContainer = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('start-button');

let score = 0;
let gameInterval;
let gameDuration = 30000; // 30 секунд
let dangerousIconsCount = 0;
let gameRunning = false;

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

    // Запуск звезд
    setInterval(spawnStar, 300);

    // Завершаем игру через 30 секунд
    setTimeout(() => {
        gameRunning = false;
        clearInterval(gameInterval);
        document.querySelectorAll('.icon').forEach(icon => icon.remove());
        alert(`Игра закончена! Ваши очки: ${score}`);
        startButton.style.display = 'block';
    }, gameDuration);
}

startButton.addEventListener('click', startGame);

function spawnIcon() {
    if (!gameRunning) return; // Если игра не активна, не генерируем

    const iconType = Math.random() < 0.2 && dangerousIconsCount < icons[0].maxCount
        ? icons[0]
        : Math.random() < 0.5
        ? icons[1]
        : icons[2];

    if (iconType.className === 'danger') dangerousIconsCount++;

    const icon = document.createElement('div');
    icon.className = `icon ${iconType.className}`;
    icon.style.left = `${Math.random() * 100}vw`;
    icon.style.animationDuration = `${5 + Math.random() * 5}s`;
    icon.style.setProperty('--fall-speed', `${3 + Math.random() * 3}s`);
    icon.style.setProperty('--rotate-speed', `${2 + Math.random() * 3}s`);

    gameContainer.appendChild(icon);

    icon.addEventListener('click', (event) => {
        event.stopPropagation(); // Предотвращаем всплытие
        score += iconType.points;
        score = Math.max(0, score); // Минимум 0
        scoreDisplay.textContent = score;
        if (iconType.className === 'danger') dangerousIconsCount--;
        createPopEffect(event.clientX, event.clientY); // Эффект лопающегося пузыря
        icon.remove();
    });

    icon.addEventListener('animationend', () => {
        if (iconType.className === 'danger') dangerousIconsCount--;
        icon.remove();
    });
}

function spawnStar() {
    if (!gameRunning) return;

    const star = document.createElement('div');
    star.className = 'star';

    // Генерация случайных координат внутри игрового контейнера
    const randomX = Math.random() * 100; // Случайное значение в процентах по ширине
    const randomY = Math.random() * 100; // Случайное значение в процентах по высоте

    // Установка позиции звезды
    star.style.left = `${randomX}vw`;
    star.style.top = `${randomY}vh`;


    // Задание случайной продолжительности анимации
    star.style.animationDuration = `${2 + Math.random() * 3}s`;

    // Добавление звезды в контейнер
    gameContainer.appendChild(star);

    // Удаление звезды после завершения анимации
    star.addEventListener('animationend', () => star.remove());
}


function createPopEffect(x, y) {
    const pop = document.createElement('div');
    pop.className = 'pop-effect';

    // Создаем несколько частей пузыря
    for (let i = 0; i < 5; i++) {
        const piece = document.createElement('div');
        piece.className = 'pop-piece';
        
        // Случайные смещения для каждой части
        const offsetX = Math.random() * 20 - 10; // От -10 до +10px
        const offsetY = Math.random() * 20 - 10; // От -10 до +10px

        // Случайный размер для каждой части
        const size = Math.random() * 6 + 4; // Размер от 4px до 10px
        piece.style.width = `${size}px`;
        piece.style.height = `${size}px`;

        piece.style.left = `${x - size / 2}px`;
        piece.style.top = `${y - size / 2}px`;
        piece.style.animationDelay = `${Math.random() * 0.2}s`; // Разные задержки для части

        pop.appendChild(piece);
    }

    gameContainer.appendChild(pop);

    // Удаляем пузырь после завершения анимации
    pop.addEventListener('animationend', () => pop.remove());
}
