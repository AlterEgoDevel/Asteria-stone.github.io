// Получаем ссылки на элементы интерфейса
const coinCircle = document.getElementById('coin-circle');
const balanceDisplay = document.getElementById('balance');
const startButton = document.getElementById('start-button');
const progressFill = document.getElementById('progress-fill');
const percentageDisplay = document.getElementById('percentage');
const timerDisplay = document.getElementById('timer');
const starContainer = document.getElementById('stars');

// Инициализируем баланс из localStorage или устанавливаем на 0
let balance = 0;
const storedBalance = localStorage.getItem('balance');
if (storedBalance && !isNaN(parseInt(storedBalance))) {
    balance = parseInt(storedBalance);
}

// Другие переменные
let progress = 0;
let interval = null;
let isFarmingActive = false;

// Функция для инициализации отображения баланса
function initializeBalance() {
    balanceDisplay.textContent = balance;
}

// Telegram WebApp логика
document.addEventListener("DOMContentLoaded", () => {
    if (typeof Telegram !== "undefined" && Telegram.WebApp) {
        Telegram.WebApp.expand();
        Telegram.WebApp.setHeaderColor("bg_color");
        const themeParams = Telegram.WebApp.themeParams;
        document.body.style.backgroundColor = themeParams.bg_color || "#ffffff";
        document.body.style.color = themeParams.text_color || "#000000";
        console.log("Приложение развернуто. Параметры темы:", themeParams);
    } else {
        console.error("Telegram WebApp API недоступен.");
    }
});

// Обработка нажатия на кнопку монеты
coinCircle?.addEventListener('click', () => {
    balance += 1;
    localStorage.setItem('balance', balance);
    balanceDisplay.textContent = balance;
});

// Логика кнопки "Start" или "Claim"
startButton?.addEventListener('click', () => {
    if (startButton.textContent === 'Start') {
        startButton.textContent = 'Farming';
        startButton.style.backgroundColor = '#7BD285';
        startButton.style.color = '#0F2412';
        startFarming();
    } else if (startButton.textContent === 'Claim') {
        balance += 4800;
        localStorage.setItem('balance', balance);
        balanceDisplay.textContent = balance;
        resetFarming();
    }
});

// Логика фарминга (таймер и прогресс)
function startFarming() {
    if (isFarmingActive) return;
    isFarmingActive = true;

    let timeRemaining = 8 * 60;
    interval = setInterval(() => {
        if (timeRemaining > 0) {
            timeRemaining--;
            progress = ((480 - timeRemaining) / 480) * 100;
            progressFill.style.width = `${progress}%`;
            percentageDisplay.textContent = `${Math.floor(progress)}%`;
            timerDisplay.textContent = formatTime(timeRemaining);
        } else {
            clearInterval(interval);
            isFarmingActive = false;
            startButton.textContent = 'Claim';
            startButton.style.backgroundColor = '#0F2412';
            startButton.style.color = '#7BD285';
        }
    }, 1000);
}

// Сброс состояния фарминга
function resetFarming() {
    progress = 0;
    progressFill.style.width = '0%';
    percentageDisplay.textContent = '0%';
    timerDisplay.textContent = '08:00';
    startButton.textContent = 'Start';
    startButton.style.backgroundColor = '#0F2412';
    startButton.style.color = '#7BD285';
    isFarmingActive = false;
}

// Форматирование времени в mm:ss
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Анимация звезд
function createStar() {
    const star = document.createElement('div');
    star.classList.add('star');

    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    star.style.left = `${x}px`;
    star.style.top = `${y}px`;

    starContainer?.appendChild(star);

    setTimeout(() => {
        star.remove();
    }, 3000);
}

// Создание звезд каждые 200 мс
setInterval(createStar, 200);

function switchPage(selectedPage) {
    // Скрываем все страницы
    const pages = document.querySelectorAll(".page");
    pages.forEach((page) => {
        page.classList.remove("active");
        page.style.display = "none"; // Скрываем явно
    });

    // Показываем выбранную страницу
    const selectedPageElement = document.getElementById(`${selectedPage}-page`);
    if (selectedPageElement) {
        selectedPageElement.classList.add("active");
        selectedPageElement.style.display = "flex"; // Отображаем явно
    } else {
        console.error(`Элемент с ID ${selectedPage}-page не найден`);
    }

    // Сбрасываем иконки
    const icons = document.querySelectorAll(".menu-icon");
    icons.forEach((icon) => {
        icon.classList.remove("active");
        icon.src = `img/${icon.id} deactive.png`; // Исправление пути для иконок
        console.log(`Иконка ${icon.id} сброшена`);
    });

    // Активируем выбранную иконку
    const selectedIcon = document.getElementById(selectedPage);
    if (selectedIcon) {
        selectedIcon.classList.add("active");
        selectedIcon.src = `img/${selectedPage} active.png?${new Date().getTime()}`;
        console.log(`Иконка ${selectedPage} активирована`);
    } else {
        console.error(`Иконка с ID ${selectedPage} не найдена`);
    }

    console.log(`Переключение на страницу: ${selectedPage}`);
}




// Инициализация баланса при загрузке страницы
window.onload = initializeBalance;