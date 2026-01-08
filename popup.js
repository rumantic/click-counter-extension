// Загрузка и отображение статистики кликов
function loadStats() {
  chrome.storage.local.get(['totalClicks', 'leftClicks', 'rightClicks', 'middleClicks'], (result) => {
    document.getElementById('totalClicks').textContent = result.totalClicks || 0;
    document.getElementById('leftClicks').textContent = result.leftClicks || 0;
    document.getElementById('rightClicks').textContent = result.rightClicks || 0;
    document.getElementById('middleClicks').textContent = result.middleClicks || 0;
  });
}

// Сброс счетчика
document.getElementById('resetBtn').addEventListener('click', () => {
  if (confirm('Вы уверены, что хотите сбросить счетчик?')) {
    chrome.storage.local.set({
      totalClicks: 0,
      leftClicks: 0,
      rightClicks: 0,
      middleClicks: 0
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
