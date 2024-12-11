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
}

// Увеличение сложности каждые 10 секунд
function increaseDifficulty() {
  const difficultyInterval = setInterval(() => {
    speed += 0.5; // Увеличиваем скорость падения
  }, 10000);
  activeIntervals.push(difficultyInterval); // Отслеживаем интервал
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
  for (let i = 0; i < objectsPerSpawn; i++) {
    const timeout = setTimeout(() => {
      const object = document.createElement('div');
      object.classList.add('object');

      // Определяем тип объекта
      const objectType = Math.random();
      if (objectType < 0.4) {
        object.style.backgroundImage = "url('img/spacex1.png')";
        object.style.width = "20px";
        object.style.height = "50px";
        object.dataset.type = 'danger';
      } else if (objectType < 0.7) {
        object.style.backgroundImage = "url('img/spacex2.png')";
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
    const playerRect = player.getBoundingClientRect();
    const objectRect = object.getBoundingClientRect();

    if (
      playerRect.left < objectRect.right &&
      playerRect.right > objectRect.left &&
      playerRect.top < objectRect.bottom &&
      playerRect.bottom > objectRect.top
    ) {
      const type = object.dataset.type;

      if (type === 'danger') {
        endGame(); // Сбрасываем игру и количество объектов
      } else if (type === 'coin') {
        score += 10;
      } else if (type === 'rare-coin') {
        score += 100;
      }

      // Увеличиваем количество объектов каждые 500 очков
      if (score >= lastMilestone + 500) {
        lastMilestone += 500;
        objectsPerSpawn++;
        console.log(`Достигнут порог ${lastMilestone}. Объектов за раз: ${objectsPerSpawn}`);
      }

      scoreDisplay.textContent = `Очки: ${score}`;
      object.remove();
      clearInterval(interval);
    }
  }, 50);

  activeIntervals.push(interval); // Добавляем в отслеживание
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
    movePlayer(touch.clientX, touch.clientY);
  }
});

// Перемещение самолёта
function movePlayer(x, y) {
  const gameRect = game.getBoundingClientRect();
  const newX = x - gameRect.left;
  const newY = y - gameRect.top;

  if (newX > 25 && newX < gameRect.width - 25) {
    player.style.left = `${newX - 25}px`;
  }
  if (newY > 25 && newY < gameRect.height - 25) {
    player.style.top = `${newY - 25}px`;
  }
}
