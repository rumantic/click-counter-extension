// Инициализация локализации
function initLocalization() {
  document.getElementById('popup-title').textContent = chrome.i18n.getMessage('popupTitle');
  document.getElementById('label-total-clicks').textContent = chrome.i18n.getMessage('totalClicks');
  document.getElementById('label-left-button').textContent = chrome.i18n.getMessage('leftButton');
  document.getElementById('label-right-button').textContent = chrome.i18n.getMessage('rightButton');
  document.getElementById('label-middle-button').textContent = chrome.i18n.getMessage('middleButton');
  document.getElementById('label-cursor-distance').textContent = chrome.i18n.getMessage('cursorDistance');
  document.getElementById('label-scroll-distance').textContent = chrome.i18n.getMessage('scrollDistance');
  document.getElementById('resetBtn').textContent = chrome.i18n.getMessage('resetButton');
  document.getElementById('settingsBtn').title = chrome.i18n.getMessage('openSettings');
}

// Функция для форматирования чисел с разделителями
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

// Функция для форматирования дистанции
function formatDistance(distanceInPixels) {
  // Конвертируем пиксели в метры (примерно 96 пикселей = 1 дюйм = 2.54 см)
  const distanceInMeters = (distanceInPixels / 96) * 0.0254;
  const distanceInKm = distanceInMeters / 1000;
  
  // Форматируем вывод в зависимости от расстояния
  if (distanceInKm >= 1) {
    return distanceInKm.toFixed(2) + ' ' + chrome.i18n.getMessage('unitKm');
  } else if (distanceInMeters >= 1) {
    return distanceInMeters.toFixed(2) + ' ' + chrome.i18n.getMessage('unitM');
  } else {
    return (distanceInMeters * 100).toFixed(0) + ' ' + chrome.i18n.getMessage('unitCm');
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
    // Форматируем числа с разделителями тысяч
    document.getElementById('totalClicks').textContent = formatNumber(result.totalClicks || 0);
    document.getElementById('leftClicks').textContent = formatNumber(result.leftClicks || 0);
    document.getElementById('rightClicks').textContent = formatNumber(result.rightClicks || 0);
    document.getElementById('middleClicks').textContent = formatNumber(result.middleClicks || 0);
    
    // Отображаем дистанцию курсора
    document.getElementById('distance').textContent = formatDistance(result.totalDistance || 0);
    
    // Отображаем дистанцию прокрутки
    document.getElementById('scroll').textContent = formatDistance(result.totalScroll || 0);
  });
}

// Сброс счетчика
document.getElementById('resetBtn').addEventListener('click', () => {
  if (confirm(chrome.i18n.getMessage('resetConfirm'))) {
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

// Открытие настроек
document.getElementById('settingsBtn').addEventListener('click', () => {
  chrome.tabs.create({ url: chrome.runtime.getURL('settings.html') });
});

// Обновление статистики при изменении в storage
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local') {
    loadStats();
  }
});

// Загрузка статистики при открытии popup
document.addEventListener('DOMContentLoaded', () => {
  initLocalization();
  loadStats();
});

// Автоматическое обновление статистики каждую секунду (для live-обновления дистанции)
setInterval(loadStats, 1000);
