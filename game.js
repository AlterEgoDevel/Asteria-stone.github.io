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

// Начало игры
function startGame() {
  menu.style.display = 'none';
  gameOverMenu.style.display = 'none';
  game.style.display = 'block';
  score = 0;
  speed = 2;
  scoreDisplay.textContent = `Очки: ${score}`;
  gameInterval = setInterval(spawnObjects, 1000); // Создаём объекты каждую секунду
  increaseDifficulty();
}

// Сброс игры
function resetGame() {
  clearInterval(gameInterval);
  document.querySelectorAll('.object').forEach(obj => obj.remove());
  game.style.display = 'none';
}

// Увеличение сложности каждые 10 секунд
function increaseDifficulty() {
  setInterval(() => {
    speed += 0.5; // Увеличиваем скорость падения
  }, 10000);
}

// Завершение игры
function endGame() {
  clearInterval(gameInterval);
  game.style.display = 'none';
  gameOverMenu.style.display = 'flex';
  finalScore.textContent = `Ваш счет: ${score}`;
}

// Создание падающих объектов
function spawnObjects() {
  for (let i = 0; i < objectsPerSpawn; i++) {
    // Создаём объект с задержкой
    setTimeout(() => {
      const object = document.createElement('div');
      object.classList.add('object');

      // Определяем тип объекта
      const objectType = Math.random();
      if (objectType < 0.4) {
        object.style.backgroundImage = "url('img/spacex1.png')";
        object.style.width = "25px";
        object.style.height = "60px";
        object.dataset.type = 'danger';
      } else if (objectType < 0.7) {
        object.style.backgroundImage = "url('img/spacex2.png')";
        object.style.width = "25px";
        object.style.height = "60px";
        object.dataset.type = 'danger';
      } else if (objectType < 0.9) {
        object.style.backgroundImage = "url('img/Vector coin 3.png')";
        object.style.width = "40px";
        object.style.height = "40px";
        object.dataset.type = 'coin';
      } else {
        object.style.backgroundImage = "url('img/Vector coin x.png')";
        object.style.width = "30px";
        object.style.height = "30px";
        object.dataset.type = 'rare-coin';
      }

      // Задаём случайное положение и длительность анимации
      object.style.left = Math.random() * (game.clientWidth - 50) + 'px';
      object.style.animationDuration = `${Math.max(2, 6 - speed)}s`;
      object.style.top = '-50px';

      game.appendChild(object);

      object.addEventListener('animationend', () => {
        object.remove();
      });

      checkCollision(object);
    }, Math.random() * 1000); // Случайная задержка до 1000 мс
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
        endGame();
      } else if (type === 'coin') {
        score += 10;
      } else if (type === 'rare-coin') {
        score += 100;
      }

      // Увеличиваем количество объектов при наборе каждых 500 очков
      if (score >= lastMilestone + 500) {
        lastMilestone += 500;
        objectsPerSpawn++;
        console.log(`Новый порог: ${lastMilestone}. Объектов за раз: ${objectsPerSpawn}`);
      }

      scoreDisplay.textContent = `Очки: ${score}`;
      object.remove();
      clearInterval(interval);
    }
  }, 50);
}


// Управление самолётом (мышь и касания)
let isDragging = false;

// Добавляем эффект при нажатии
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
