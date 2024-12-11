// Элементы интерфейса
const menu = document.getElementById('menu');
const game = document.getElementById('game');
const gameOverMenu = document.getElementById('gameOverMenu');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const backToMenuButton = document.getElementById('backToMenuButton');
const player = document.getElementById('player');
const scoreDisplay = document.getElementById('score');
const finalScore = document.getElementById('finalScore');

// Переменные игры
let gameInterval;
let score = 0;
let speed = 2;

let objectsPerSpawn = 1; // Количество объектов за раз
let lastMilestone = 0; // Для отслеживания порога очков

let activeIntervals = []; // Массив для отслеживания активных интервалов и таймаутов

// Обработчик кнопки "Начать игру"
startButton.addEventListener('click', startGame);
// Обработчик кнопки "Сначала"
restartButton.addEventListener('click', startGame);
// Обработчик кнопки "Назад в меню"
backToMenuButton.addEventListener('click', () => {
  gameOverMenu.style.display = 'none';
  menu.style.display = 'flex';
  resetGame();
});

// Очищаем все интервалы и таймауты
function clearAllIntervals() {
  activeIntervals.forEach((id) => {
    clearInterval(id);
    clearTimeout(id);
  });
  activeIntervals = []; // Очищаем массив
}

// Начало игры
function startGame() {
  clearAllIntervals(); // Очищаем интервалы и таймауты
  document.querySelectorAll('.object').forEach((obj) => obj.remove()); // Удаляем оставшиеся объекты
  menu.style.display = 'none';
  gameOverMenu.style.display = 'none';
  game.style.display = 'block';

  // Сброс переменных игры
  score = 0;
  speed = 2;
  objectsPerSpawn = 1; // Сбрасываем количество объектов
  lastMilestone = 0;   // Сбрасываем порог увеличения сложности

  // Устанавливаем начальное положение самолёта
  player.style.left = `calc(50% - ${player.offsetWidth / 2}px)`; // Центр по горизонтали
  player.style.bottom = '50px'; // 50px от нижнего края
  player.style.top = ''; // Сбрасываем, если ранее использовалось
  player.style.right = ''; // Сбрасываем, если ранее использовалось

  scoreDisplay.textContent = `Очки: ${score}`;
  gameInterval = setInterval(spawnObjects, 1000); // Создаём объекты каждую секунду
  activeIntervals.push(gameInterval); // Добавляем в отслеживание

  increaseDifficulty();
}

// Сброс игры
function resetGame() {
  clearAllIntervals(); // Очищаем все интервалы и таймауты
  document.querySelectorAll('.object').forEach((obj) => obj.remove()); // Удаляем все объекты
  game.style.display = 'none';

  // Сбрасываем позицию самолёта
  player.style.left = `calc(50% - ${player.offsetWidth / 2}px)`; // Центр по горизонтали
  player.style.bottom = '50px'; // 50px от нижнего края
  player.style.top = ''; // Сбрасываем, если ранее использовалось
  player.style.right = ''; // Сбрасываем, если ранее использовалось
}

// Увеличение сложности каждые 10 секунд
function increaseDifficulty() {
  const difficultyInterval = setInterval(() => {
    speed += 0.5; // Увеличиваем скорость падения
  }, 10000);
  activeIntervals.push(difficultyInterval); // Отслеживаем интервал
}

// Логика обновления сложности
function updateDifficulty() {
  if (score >= lastMilestone + 500) {
    lastMilestone += 500; // Обновляем порог
    objectsPerSpawn += 1; // Увеличиваем количество объектов
  }
}

// Завершение игры
function endGame() {
  clearAllIntervals(); // Очищаем все интервалы и таймауты
  document.querySelectorAll('.object').forEach((obj) => obj.remove()); // Удаляем все объекты
  game.style.display = 'none';
  gameOverMenu.style.display = 'flex';
  finalScore.textContent = `Ваш счет: ${score}`;
  objectsPerSpawn = 1; // Сбрасываем количество объектов
}

// Создание падающих объектов
function spawnObjects() {
  updateDifficulty(); // Проверяем и обновляем сложность

  for (let i = 0; i < objectsPerSpawn; i++) {
    const timeout = setTimeout(() => {
      const object = document.createElement('div');
      object.classList.add('object');

      // Определяем тип объекта
      const objectType = Math.random();
      if (objectType < 0.4) {
        object.style.backgroundImage = "url('img/spacex4.png')";
        object.style.width = "20px";
        object.style.height = "50px";
        object.dataset.type = 'danger';
      } else if (objectType < 0.7) {
        object.style.backgroundImage = "url('img/spacex5.png')";
        object.style.width = "20px";
        object.style.height = "50px";
        object.dataset.type = 'danger';
      } else if (objectType < 0.9) {
        object.style.backgroundImage = "url('img/Vector coin 3.png')";
        object.style.width = "40px";
        object.style.height = "40px";
        object.dataset.type = 'coin';
      } else {
        object.style.backgroundImage = "url('img/Vector coin x.png')";
        object.style.width = "30px";
        object.style.height = "24px";
        object.dataset.type = 'rare-coin';
      }

      // Позиция и анимация
      object.style.left = Math.random() * (game.clientWidth - 50) + 'px';
      object.style.animationDuration = `${Math.max(2, 6 - speed)}s`;
      object.style.top = '-50px';

      game.appendChild(object);

      object.addEventListener('animationend', () => {
        object.remove();
      });

      checkCollision(object);
    }, Math.random() * 1000); // Случайная задержка

    activeIntervals.push(timeout); // Добавляем в отслеживание
  }
}

// Проверка столкновений
function checkCollision(object) {
  const interval = setInterval(() => {
    const playerHitbox = player.querySelector('.hitbox').getBoundingClientRect();
    const objectRect = object.getBoundingClientRect();

    if (
      playerHitbox.left < objectRect.right &&
      playerHitbox.right > objectRect.left &&
      playerHitbox.top < objectRect.bottom &&
      playerHitbox.bottom > objectRect.top
    ) {
      const type = object.dataset.type;

      if (type === 'danger') {
        endGame();
      } else if (type === 'coin') {
        score += 10;
      } else if (type === 'rare-coin') {
        score += 100;
      }

      scoreDisplay.textContent = `Очки: ${score}`;
      object.remove();
      clearInterval(interval);
    }
  }, 50);

  activeIntervals.push(interval);
}



// Управление самолётом (мышь и касания)
let isDragging = false;

player.addEventListener('mousedown', () => {
  isDragging = true;
  player.classList.add('pressed'); // Визуализация нажатия
});

document.addEventListener('mouseup', () => {
  isDragging = false;
  player.classList.remove('pressed'); // Убираем эффект
});

document.addEventListener('mousemove', (e) => {
  if (isDragging) {
    movePlayer(e.clientX, e.clientY);
  }
});

player.addEventListener('touchstart', (e) => {
  isDragging = true;
  player.classList.add('pressed'); // Визуализация для касания
  e.preventDefault();
});

document.addEventListener('touchend', () => {
  isDragging = false;
  player.classList.remove('pressed'); // Убираем эффект
});

document.addEventListener('touchmove', (e) => {
  if (isDragging) {
    const touch = e.touches[0];
    const gameRect = game.getBoundingClientRect();

    // Учет смещения внутри игрового поля
    const touchX = touch.clientX - gameRect.left;
    const touchY = touch.clientY - gameRect.top;

    movePlayer(touchX, touchY);
    e.preventDefault(); // Предотвращает нежелательную прокрутку
  }
});


// Перемещение самолёта
function movePlayer(x, y) {
  const gameRect = game.getBoundingClientRect();
  const playerWidth = player.offsetWidth;
  const playerHeight = player.offsetHeight;

  // Перемещение по оси X
  const newX = Math.max(0, Math.min(x - gameRect.left - playerWidth / 2, gameRect.width - playerWidth));
  player.style.left = `${newX}px`;

  // Перемещение по оси Y
  const newY = Math.max(0, Math.min(y - gameRect.top - playerHeight / 2, gameRect.height - playerHeight));
  player.style.top = `${newY}px`;
}


function createStars(containerId, numStars = 100) {
  const container = document.getElementById(containerId);

  for (let i = 0; i < numStars; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.animationDelay = `${Math.random() * 3}s`; // Рандомная задержка мерцания
    container.appendChild(star);
  }
}

// Звёзды в меню
createStars('stars', 100);

// Звёзды в игре
createStars('gameStars', 100);

