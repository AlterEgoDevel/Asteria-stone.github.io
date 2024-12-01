// Функция инициализации игры
const initGame = () => {
    let score = 0; // Переменная для хранения текущего счёта
  
    // Событие для кнопки "Start Playing"
    document.getElementById('startGame').addEventListener('click', () => {
      score += 10; // Увеличиваем счёт на 10 каждый раз при нажатии
      document.getElementById('score').textContent = `Score: ${score}`; // Обновляем текст на странице
  
      // Используем Telegram Games API для отправки счёта в Telegram
      TelegramGameProxy.setScore({ score: score }, (result) => {
        console.log('Score sent to Telegram:', result); // Выводим результат в консоль
      });
    });
  };
  
  // Запускаем игру при загрузке страницы
  initGame();
