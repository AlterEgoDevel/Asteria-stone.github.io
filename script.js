/* Основной стиль страницы */
body {
    margin: 0;
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    overflow: hidden;
  }
  
  /* Меню (начальное и конечное) */
  .menu {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  
  button {
    padding: 15px 30px;
    margin: 10px;
    font-size: 18px;
    cursor: pointer;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  
  /* Игровая зона */
  .game {
    display: none;
    position: relative;
    width: 100%;
    height: 100vh;
    background-color: #000;
    overflow: hidden;
  }
  
  /* Самолётик игрока */
  .player {
    position: absolute;
    bottom: 50px;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 50px;
    background-image: url('img/airforse.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    transition: transform 0.2s ease; /* Плавный переход для визуализации */
  }
  
  .player.pressed {
    transform: translateX(-50%) scale(1.1); /* Увеличение и выдвижение вперёд */
  }
  
  /* Объекты (падающие) */
  .object {
    position: absolute;
    top: -50px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    animation: fall linear;
  }
  
  @keyframes fall {
    0% {
      top: -50px;
    }
    100% {
      top: 100%;
    }
  }
  
  /* Конечное меню */
  #gameOverMenu {
    display: none;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
  }
  
  /* Счёт игрока */
  .score {
    position: absolute;
    top: 10px;
    left: 10px;
    font-size: 20px;
    color: #fff;
    font-weight: bold;
    z-index: 10;
  }
  