"""
Создаёт ZIP-архив расширения для публикации в Chrome Web Store.
Исключает служебные файлы и папки разработки.
"""

import zipfile
from pathlib import Path
from datetime import datetime

# Корневая папка проекта
ROOT = Path(__file__).resolve().parent

# Файлы и папки для включения в архив
INCLUDE_PATTERNS = [
    "manifest.json",
    "popup.html",
    "popup.css",
    "popup.js",
    "settings.html",
    "settings.js",
    "content.js",
    "icons/icon16.png",
    "icons/icon48.png",
    "icons/icon128.png",
    "_locales/**/*",
    "README.md",
    "PRIVACY_POLICY.md",
]

# Папки и файлы для исключения (не попадут в архив)
EXCLUDE_PATTERNS = [
    ".git",
    ".venv",
    "__pycache__",
    "*.pyc",
    ".gitignore",
    ".vscode",
    ".idea",
    "node_modules",
    "*.log",
    "*.tmp",
    ".DS_Store",
    "Thumbs.db",
    # Исключаем служебные файлы из icons/
    "icons/generate_icons.py",
    "icons/generate_icons_from_source.py",
    "icons/create-icons.html",
    "icons/icon-source.base64.txt",
    "icons/mouse-icon.png",
    # Исключаем служебную документацию
    "PUBLICATION_GUIDE.md",
]


def should_exclude(file_path: Path, relative_path: Path) -> bool:
    """Проверяет, нужно ли исключить файл из архива."""
    path_str = str(relative_path).replace("\\", "/")
    
    for pattern in EXCLUDE_PATTERNS:
        if pattern.startswith("*"):
            # Проверка по расширению
            if path_str.endswith(pattern[1:]):
                return True
        elif "/" in pattern:
            # Точный путь
            if path_str == pattern or path_str.startswith(pattern + "/"):
                return True
        else:
            # Имя файла или папки
            if pattern in relative_path.parts:
                return True
    
    return False


def get_version() -> str:
    """Извлекает версию из manifest.json."""
    import json
    manifest_path = ROOT / "manifest.json"
    
    if manifest_path.exists():
        with open(manifest_path, "r", encoding="utf-8") as f:
            manifest = json.load(f)
            return manifest.get("version", "1.0.0")
    
    return "1.0.0"


def collect_files() -> list[Path]:
    """Собирает список файлов для архивирования."""
    files_to_add = []
    
    # Добавляем файлы по шаблонам
    for pattern in INCLUDE_PATTERNS:
        if "**" in pattern:
            # Рекурсивный поиск
            base_pattern = pattern.replace("/**/*", "")
            base_path = ROOT / base_pattern
            if base_path.exists():
                for file_path in base_path.rglob("*"):
                    if file_path.is_file():
                        rel_path = file_path.relative_to(ROOT)
                        if not should_exclude(file_path, rel_path):
                            files_to_add.append(file_path)
        else:
            # Прямой путь
            file_path = ROOT / pattern
            if file_path.exists() and file_path.is_file():
                rel_path = file_path.relative_to(ROOT)
                if not should_exclude(file_path, rel_path):
                    files_to_add.append(file_path)
    
    return sorted(set(files_to_add))


def create_archive() -> Path:
    """Создаёт ZIP-архив расширения."""
    version = get_version()
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    archive_name = f"MouseStat-v{version}-{timestamp}.zip"
    archive_path = ROOT / archive_name
    
    files = collect_files()
    
    print(f"📦 Создание архива: {archive_name}")
    print(f"📝 Версия: {version}")
    print(f"📁 Файлов для архивирования: {len(files)}\n")
    
    with zipfile.ZipFile(archive_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for file_path in files:
            arcname = file_path.relative_to(ROOT)
            zf.write(file_path, arcname)
            print(f"  ✓ {arcname}")
    
    size_mb = archive_path.stat().st_size / (1024 * 1024)
    print(f"\n✅ Архив создан: {archive_name}")
    print(f"📊 Размер: {size_mb:.2f} MB")
    print(f"📍 Путь: {archive_path}")
    
    return archive_path


def main():
    """Основная функция."""
    try:
        archive_path = create_archive()
        
        print("\n" + "="*60)
        print("🎉 Готово к публикации в Chrome Web Store!")
        print("="*60)
        print("\n📋 Следующие шаги:")
        print("1. Откройте https://chrome.google.com/webstore/devconsole/")
        print("2. Нажмите 'New item' или обновите существующее расширение")
        print(f"3. Загрузите архив: {archive_path.name}")
        print("4. Заполните информацию о расширении")
        print("5. Отправьте на модерацию")
        
    except Exception as e:
        print(f"\n❌ Ошибка при создании архива: {e}")
        raise


if __name__ == "__main__":
    main()
