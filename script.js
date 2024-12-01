// script.js
let isDriving = false;
let distance = 0; // Пройденное расстояние за поездку
let points = 0; // Очки за текущую поездку
let totalPoints = 0; // Общая сумма очков за всё время
let timeLeft = 3 * 60 * 60; // В секундах (3 часа)
let carPosition = 0; // Позиция машины в процентах
let timerInterval = null;

// Загружаем данные пользователя из localStorage
function loadProgress() {
    const savedTotalPoints = localStorage.getItem("totalPoints");

    totalPoints = savedTotalPoints ? parseFloat(savedTotalPoints) : 0;

    updateStats();
}

function saveProgress() {
    localStorage.setItem("totalPoints", totalPoints.toFixed(0));
}

const startButton = document.getElementById("start-btn");
const refuelButton = document.getElementById("refuel-btn");
const distanceDisplay = document.getElementById("distance");
const statusMessage = document.getElementById("status-message");
const car = document.getElementById("car");
const timeLeftDisplay = document.getElementById("time-left");

// Обновление времени
function updateTimeLeft() {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;

    timeLeftDisplay.textContent = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Обновление статистики
function updateStats() {
    distanceDisplay.textContent = `${distance.toFixed(1)} км`;
    document.getElementById("points").textContent = `${points.toFixed(0)} очков`;
    document.getElementById("total-points").textContent = `${totalPoints.toFixed(0)} очков`;
}

// Запуск машины
startButton.addEventListener("click", () => {
    if (isDriving) return;

    isDriving = true;
    statusMessage.textContent = "Машина едет...";
    carPosition = 0; // Сброс позиции машины
    car.style.left = "0%";

    timerInterval = setInterval(() => {
        timeLeft -= 1;
        carPosition += (1 / (3 * 60 * 60)) * 100; // Прогресс в процентах

        // Если время закончилось, останавливаем машину
        if (timeLeft <= 0 || carPosition >= 100) {
            stopCar();
            return;
        }

        // Обновляем пройденный путь и положение машины
        distance += 0.1; // 0.1 км за каждую секунду
        points = distance * 100; // Очки за текущую поездку
        car.style.left = `${carPosition}%`;

        updateStats();
        updateTimeLeft();
    }, 1000);
});

// Остановка машины
function stopCar() {
    isDriving = false;
    clearInterval(timerInterval);
    car.style.left = "100%"; // Машина останавливается на 100%
    totalPoints += points; // Добавляем очки в общую сумму
    points = 0; // Сбрасываем текущие очки
    distance = 0; // Сбрасываем пройденное расстояние
    statusMessage.textContent = "Машина остановилась! Заправьте её, чтобы продолжить.";
    refuelButton.disabled = false;
    startButton.disabled = true;
    saveProgress();
}

// Заправка машины
refuelButton.addEventListener("click", () => {
    if (isDriving) return;

    refuelButton.disabled = true;
    startButton.disabled = false;
    timeLeft = 3 * 60 * 60; // Сбрасываем время
    carPosition = 0; // Сбрасываем позицию
    car.style.left = "0%"; // Машина возвращается в начало
    statusMessage.textContent = "Машина заправлена! Нажмите 'Старт', чтобы продолжить.";
    updateTimeLeft();
});

// Загружаем прогресс при загрузке страницы
loadProgress();
updateTimeLeft();
