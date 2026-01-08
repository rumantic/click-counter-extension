// Загрузка и отображение статистики
function loadStats() {
  chrome.storage.local.get([
    'totalClicks', 
    'leftClicks', 
    'rightClicks', 
    'middleClicks',
    'totalDistance'
  ], (result) => {
    document.getElementById('totalClicks').textContent = result.totalClicks || 0;
    document.getElementById('leftClicks').textContent = result.leftClicks || 0;
    document.getElementById('rightClicks').textContent = result.rightClicks || 0;
    document.getElementById('middleClicks').textContent = result.middleClicks || 0;
    
    // Конвертируем пиксели в метры (примерно 96 пикселей = 1 дюйм = 2.54 см)
    const distanceInPixels = result.totalDistance || 0;
    const distanceInMeters = (distanceInPixels / 96) * 0.0254; // переводим в метры
    const distanceInKm = distanceInMeters / 1000;
    
    // Форматируем вывод в зависимости от расстояния
    if (distanceInKm >= 1) {
      document.getElementById('distance').textContent = distanceInKm.toFixed(2) + ' км';
    } else if (distanceInMeters >= 1) {
      document.getElementById('distance').textContent = distanceInMeters.toFixed(2) + ' м';
    } else {
      document.getElementById('distance').textContent = (distanceInMeters * 100).toFixed(0) + ' см';
    }
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
      totalDistance: 0
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
