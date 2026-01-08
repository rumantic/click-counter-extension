// Функция для форматирования дистанции
function formatDistance(distanceInPixels) {
  // Конвертируем пиксели в метры (примерно 96 пикселей = 1 дюйм = 2.54 см)
  const distanceInMeters = (distanceInPixels / 96) * 0.0254;
  const distanceInKm = distanceInMeters / 1000;
  
  // Форматируем вывод в зависимости от расстояния
  if (distanceInKm >= 1) {
    return distanceInKm.toFixed(2) + ' км';
  } else if (distanceInMeters >= 1) {
    return distanceInMeters.toFixed(2) + ' м';
  } else {
    return (distanceInMeters * 100).toFixed(0) + ' см';
  }
}

// Загрузка и отображение статистики
function loadStats() {
  chrome.storage.local.get([
    'totalClicks', 
    'leftClicks', 
    'rightClicks', 
    'middleClicks',
    'totalDistance',
    'totalScroll'
  ], (result) => {
    document.getElementById('totalClicks').textContent = result.totalClicks || 0;
    document.getElementById('leftClicks').textContent = result.leftClicks || 0;
    document.getElementById('rightClicks').textContent = result.rightClicks || 0;
    document.getElementById('middleClicks').textContent = result.middleClicks || 0;
    
    // Отображаем дистанцию курсора
    document.getElementById('distance').textContent = formatDistance(result.totalDistance || 0);
    
    // Отображаем дистанцию прокрутки
    document.getElementById('scroll').textContent = formatDistance(result.totalScroll || 0);
  });
}

// Сброс счетчика
document.getElementById('resetBtn').addEventListener('click', () => {
  if (confirm('Вы уверены, что хотите сбросить счетчик?')) {
    chrome.storage.local.set({
      totalClicks: 0,
      leftClicks: 0,
      rightClicks: 0,
      middleClicks: 0,
      totalDistance: 0,
      totalScroll: 0
    }, () => {
      loadStats();
    });
  }
});

// Обновление статистики при изменении в storage
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local') {
    loadStats();
  }
});

// Загрузка статистики при открытии popup
document.addEventListener('DOMContentLoaded', loadStats);

// Автоматическое обновление статистики каждую секунду (для live-обновления дистанции)
setInterval(loadStats, 1000);
