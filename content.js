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

// Предотвращаем всплытие контекстного меню для правой кнопки (опционально)
// Раскомментируйте, если хотите отключить контекстное меню
// document.addEventListener('contextmenu', (event) => {
//   event.preventDefault();
// }, true);
