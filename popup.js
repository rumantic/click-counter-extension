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
  document.getElementById('shareBtn').title = chrome.i18n.getMessage('shareButton');
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

// Функция для генерации изображения статистики
async function generateShareImage() {
  try {
    // Получаем текущие данные из storage
    const result = await chrome.storage.local.get([
      'totalClicks', 
      'leftClicks', 
      'rightClicks', 
      'middleClicks',
      'totalDistance',
      'totalScroll'
    ]);

    // Создаем canvas для рисования
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Размеры изображения
    const width = 800;
    const height = 600;
    canvas.width = width;
    canvas.height = height;
    
    // Создаем градиентный фон
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Добавляем белый прямоугольник для контента
    ctx.fillStyle = 'white';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 10;
    ctx.fillRect(40, 80, width - 80, height - 160);
    ctx.shadowColor = 'transparent';
    
    // Заголовок
    ctx.fillStyle = 'white';
    ctx.font = 'bold 48px "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🖱️ MouseStat', width / 2, 55);
    
    // Подзаголовок
    ctx.font = '24px "Segoe UI", Arial, sans-serif';
    ctx.fillText(chrome.i18n.getMessage('shareTitle'), width / 2, 130);
    
    // Статистика
    ctx.fillStyle = '#333';
    ctx.font = 'bold 20px "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'left';
    
    const stats = [
      { label: chrome.i18n.getMessage('totalClicks'), value: formatNumber(result.totalClicks || 0) },
      { label: chrome.i18n.getMessage('leftButton'), value: formatNumber(result.leftClicks || 0) },
      { label: chrome.i18n.getMessage('rightButton'), value: formatNumber(result.rightClicks || 0) },
      { label: chrome.i18n.getMessage('middleButton'), value: formatNumber(result.middleClicks || 0) },
      { label: chrome.i18n.getMessage('cursorDistance'), value: formatDistance(result.totalDistance || 0) },
      { label: chrome.i18n.getMessage('scrollDistance'), value: formatDistance(result.totalScroll || 0) }
    ];
    
    let y = 200;
    stats.forEach((stat, index) => {
      // Метка
      ctx.fillStyle = '#666';
      ctx.font = '18px "Segoe UI", Arial, sans-serif';
      ctx.fillText(stat.label, 80, y);
      
      // Значение
      ctx.fillStyle = index >= 4 ? '#764ba2' : '#667eea';
      ctx.font = 'bold 24px "Segoe UI", Arial, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(stat.value, width - 80, y);
      ctx.textAlign = 'left';
      
      y += 60;
    });
    
    // Футер
    ctx.fillStyle = 'white';
    ctx.font = '18px "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Chrome Web Store: MouseStat', width / 2, height - 30);
    
    // Конвертируем canvas в blob
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/png');
    });
  } catch (error) {
    console.error('Error generating share image:', error);
    throw error;
  }
}

// Обработчик кнопки "Поделиться"
document.getElementById('shareBtn').addEventListener('click', async () => {
  try {
    const shareBtn = document.getElementById('shareBtn');
    const originalText = shareBtn.title;
    
    // Показываем индикатор загрузки
    shareBtn.textContent = '⏳';
    shareBtn.disabled = true;
    
    // Генерируем изображение
    const blob = await generateShareImage();
    
    // Создаем файл для скачивания
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mousestat-stats-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Возвращаем кнопку в исходное состояние
    shareBtn.textContent = '📤';
    shareBtn.disabled = false;
    shareBtn.title = originalText;
  } catch (error) {
    console.error('Share error:', error);
    alert('Error generating share image');
    
    // Возвращаем кнопку в исходное состояние
    const shareBtn = document.getElementById('shareBtn');
    shareBtn.textContent = '📤';
    shareBtn.disabled = false;
  }
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
