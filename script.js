// Элементы
const stone = document.getElementById('stone');
const pointsDisplay = document.getElementById('points');
const statsBtn = document.getElementById('statsBtn');
const coinsBtn = document.getElementById('coinsBtn');
const rankBtn = document.getElementById('rankBtn');

// Состояние игры
let points = 0;
let coins = 0;

// Обработчик нажатия на камень
stone.addEventListener('click', () => {
  points++;
  coins += 1; // Количество монет может отличаться, можно сделать множитель
  pointsDisplay.textContent = points;
});

// Обработчики кнопок
statsBtn.addEventListener('click', () => {
  alert(`Статистика:\nПоинты: ${points}\nМонеты: ${coins}`);
});

coinsBtn.addEventListener('click', () => {
  alert(`У вас ${coins} монет!`);
});

rankBtn.addEventListener('click', () => {
  alert('Рейтинг пока недоступен!');
});
