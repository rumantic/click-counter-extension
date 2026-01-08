// Переменные для отслеживания позиции мыши и накопления дистанции
let lastX = null;
let lastY = null;
let accumulatedDistance = 0; // Накапливаем дистанцию движения курсора
let accumulatedScroll = 0; // Накапливаем дистанцию прокрутки

// Функция для сохранения накопленных данных в storage
function saveStats() {
  // Сохраняем дистанцию курсора
  if (accumulatedDistance > 0) {
    chrome.storage.local.get(['totalDistance'], (result) => {
      const currentDistance = result.totalDistance || 0;
      chrome.storage.local.set({
        totalDistance: currentDistance + accumulatedDistance
      });
      accumulatedDistance = 0; // Обнуляем после сохранения
    });
  }
  
  // Сохраняем дистанцию прокрутки
  if (accumulatedScroll > 0) {
    chrome.storage.local.get(['totalScroll'], (result) => {
      const currentScroll = result.totalScroll || 0;
      chrome.storage.local.set({
        totalScroll: currentScroll + accumulatedScroll
      });
      accumulatedScroll = 0; // Обнуляем после сохранения
    });
  }
}

// Сохраняем статистику раз в 2 секунды (вместо каждого события)
setInterval(saveStats, 2000);

// Сохраняем при закрытии страницы (чтобы не потерять данные)
window.addEventListener('beforeunload', saveStats);

// Отслеживание прокрутки колесиком мыши
document.addEventListener('wheel', (event) => {
  // event.deltaY - величина прокрутки по вертикали в пикселях
  // event.deltaX - величина прокрутки по горизонтали в пикселях
  const scrollDistance = Math.abs(event.deltaY) + Math.abs(event.deltaX);
  
  // Накапливаем дистанцию прокрутки в памяти
  accumulatedScroll += scrollDistance;
}, { passive: true });

// Отслеживание движения мыши для подсчета дистанции
document.addEventListener('mousemove', (event) => {
  if (lastX !== null && lastY !== null) {
    // Вычисляем расстояние по теореме Пифагора
    const deltaX = event.clientX - lastX;
    const deltaY = event.clientY - lastY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Накапливаем дистанцию в памяти (очень быстро, без записи в storage)
    accumulatedDistance += distance;
  }
  
  lastX = event.clientX;
  lastY = event.clientY;
}, { passive: true }); // passive: true для оптимизации производительности

// Слушатель событий клика мыши
document.addEventListener('mousedown', (event) => {
  // Получаем текущую статистику
  chrome.storage.local.get(['totalClicks', 'leftClicks', 'rightClicks', 'middleClicks'], (result) => {
    let totalClicks = result.totalClicks || 0;
    let leftClicks = result.leftClicks || 0;
    let rightClicks = result.rightClicks || 0;
    let middleClicks = result.middleClicks || 0;

    // Увеличиваем общий счетчик
    totalClicks++;

    // Определяем, какая кнопка мыши была нажата
    switch (event.button) {
      case 0: // Левая кнопка
        leftClicks++;
        break;
      case 1: // Средняя кнопка (колесо)
        middleClicks++;
        break;
      case 2: // Правая кнопка
        rightClicks++;
        break;
    }

    // Сохраняем обновленную статистику
    chrome.storage.local.set({
      totalClicks: totalClicks,
      leftClicks: leftClicks,
      rightClicks: rightClicks,
      middleClicks: middleClicks
    });
  });
}, true);
