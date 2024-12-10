// script.js
const menu = document.getElementById('menu');
const game = document.getElementById('game');
const gameOverMenu = document.getElementById('gameOverMenu');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const backToMenuButton = document.getElementById('backToMenuButton');
const player = document.getElementById('player');
const scoreDisplay = document.getElementById('score');
const finalScore = document.getElementById('finalScore');

let gameInterval;
let score = 0;
let speed = 2;

// Обработчики кнопок
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);
backToMenuButton.addEventListener('click', () => {
  gameOverMenu.style.display = 'none';
  menu.style.display = 'flex';
  resetGame();
});

// Начать игру
function startGame() {
  menu.style.display = 'none';
  gameOverMenu.style.display = 'none';
  game.style.display = 'block';
  score = 0;
  speed = 2;
  scoreDisplay.textContent = `Очки: ${score}`;
  gameInterval = setInterval(spawnObjects, 1000);
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
    speed += 0.5;
  }, 10000);
}

// Завершение игры
function endGame() {
  clearInterval(gameInterval);
  game.style.display = 'none';
  gameOverMenu.style.display = 'flex';
  finalScore.textContent = `Ваш счет: ${score}`;
}

// Создание объектов
function spawnObjects() {
  const object = document.createElement('div');
  object.classList.add('object');

  const objectType = Math.random();
  if (objectType < 0.4) {
    object.style.backgroundImage = "url('img/spacex1.png')";
    object.style.width = "30px";
    object.style.height = "60px";
    object.dataset.type = 'danger';
  } else if (objectType < 0.7) {
    object.style.backgroundImage = "url('img/spacex2.png')";
    object.style.width = "30px";
    object.style.height = "70px";
    object.dataset.type = 'danger';
  } else if (objectType < 0.9) {
    object.style.backgroundImage = "url('img/Vector coin 3.png')";
    object.style.width = "40px";
    object.style.height = "40px";
    object.dataset.type = 'coin';
  } else {
    object.style.backgroundImage = "url('img/Vector coin x.png')";
    object.style.width = "50px";
    object.style.height = "50px";
    object.dataset.type = 'rare-coin';
  }

  object.style.left = Math.random() * (game.clientWidth - 50) + 'px';
  object.style.animationDuration = `${Math.max(2, 6 - speed)}s`;
  object.style.top = '-50px';

  game.appendChild(object);

  object.addEventListener('animationend', () => {
    object.remove();
  });

  checkCollision(object);
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

      scoreDisplay.textContent = `Очки: ${score}`;
      object.remove();
      clearInterval(interval);
    }
  }, 50);
}

// Управление самолётом (мышь и касания)
let isDragging = false;

player.addEventListener('mousedown', () => {
  isDragging = true;
});
document.addEventListener('mouseup', () => {
  isDragging = false;
});
document.addEventListener('mousemove', (e) => {
  if (isDragging) {
    movePlayer(e.clientX, e.clientY);
  }
});

player.addEventListener('touchstart', (e) => {
  isDragging = true;
  e.preventDefault();
});
document.addEventListener('touchend', () => {
  isDragging = false;
});
document.addEventListener('touchmove', (e) => {
  if (isDragging) {
    const touch = e.touches[0];
    movePlayer(touch.clientX, touch.clientY);
  }
});

// Функция для перемещения игрока
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
