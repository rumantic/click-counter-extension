// Инициализация локализации
function initLocalization() {
  document.getElementById('settings-title').textContent = chrome.i18n.getMessage('settingsTitle');
  document.getElementById('settings-subtitle').textContent = chrome.i18n.getMessage('settingsSubtitle');
  
  document.getElementById('data-management-title').textContent = chrome.i18n.getMessage('dataManagementTitle');
  document.getElementById('data-info').textContent = chrome.i18n.getMessage('dataInfo');
  document.getElementById('clearDataBtn').textContent = chrome.i18n.getMessage('clearDataButton');
  
  document.getElementById('links-title').textContent = chrome.i18n.getMessage('linksTitle');
  document.getElementById('links-description').textContent = chrome.i18n.getMessage('linksDescription');
  document.getElementById('developer-link').textContent = chrome.i18n.getMessage('developerLink');
  
  document.getElementById('permissions-title').textContent = chrome.i18n.getMessage('permissionsTitle');
  document.getElementById('permissions-description').textContent = chrome.i18n.getMessage('permissionsDescription');
  document.getElementById('permission-storage').textContent = chrome.i18n.getMessage('permissionStorage');
  
  document.getElementById('privacy-title').textContent = chrome.i18n.getMessage('privacyTitle');
  document.getElementById('privacy-text-1').textContent = chrome.i18n.getMessage('privacyText1');
  document.getElementById('privacy-text-2').textContent = chrome.i18n.getMessage('privacyText2');
  document.getElementById('privacy-text-3').textContent = chrome.i18n.getMessage('privacyText3');
  
  document.getElementById('about-title').textContent = chrome.i18n.getMessage('aboutTitle');
  document.getElementById('about-description').textContent = chrome.i18n.getMessage('aboutDescription');
  document.getElementById('version-label').textContent = chrome.i18n.getMessage('versionLabel');
  document.getElementById('author-label').textContent = chrome.i18n.getMessage('authorLabel');
  
  document.getElementById('confirm-title').textContent = chrome.i18n.getMessage('confirmTitle');
  document.getElementById('confirm-message').textContent = chrome.i18n.getMessage('confirmMessage');
  document.getElementById('confirmYes').textContent = chrome.i18n.getMessage('confirmYes');
  document.getElementById('confirmNo').textContent = chrome.i18n.getMessage('confirmNo');
}

// Показать уведомление
function showNotification(message) {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.classList.add('show');
  
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

// Показать диалог подтверждения
function showConfirmDialog() {
  document.getElementById('confirmDialog').classList.add('show');
}

// Скрыть диалог подтверждения
function hideConfirmDialog() {
  document.getElementById('confirmDialog').classList.remove('show');
}

// Очистка данных
function clearAllData() {
  chrome.storage.local.clear(() => {
    hideConfirmDialog();
    showNotification(chrome.i18n.getMessage('dataCleared'));
  });
}

// Обработчики событий
document.getElementById('clearDataBtn').addEventListener('click', showConfirmDialog);
document.getElementById('confirmYes').addEventListener('click', clearAllData);
document.getElementById('confirmNo').addEventListener('click', hideConfirmDialog);

// Закрытие диалога по клику вне его
document.getElementById('confirmDialog').addEventListener('click', (e) => {
  if (e.target.id === 'confirmDialog') {
    hideConfirmDialog();
  }
});

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', initLocalization);
