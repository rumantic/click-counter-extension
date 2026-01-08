from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size, filename):
    # Создаем изображение с градиентом
    img = Image.new('RGB', (size, size), color='white')
    draw = ImageDraw.Draw(img)
    
    # Рисуем градиентный фон (фиолетовый)
    for y in range(size):
        # Градиент от #667eea до #764ba2
        r = int(102 + (118 - 102) * y / size)
        g = int(126 + (75 - 126) * y / size)
        b = int(234 + (162 - 234) * y / size)
        draw.line([(0, y), (size, y)], fill=(r, g, b))
    
    # Рисуем курсор мыши (белый)
    scale = size / 128
    center_x = size // 2
    center_y = size // 2
    
    cursor_points = [
        (center_x - int(15 * scale), center_y - int(20 * scale)),
        (center_x - int(15 * scale), center_y + int(20 * scale)),
        (center_x - int(5 * scale), center_y + int(5 * scale)),
        (center_x + int(5 * scale), center_y + int(25 * scale)),
        (center_x + int(12 * scale), center_y + int(22 * scale)),
        (center_x + int(5 * scale), center_y + int(2 * scale)),
        (center_x + int(20 * scale), center_y - int(5 * scale)),
    ]
    
    draw.polygon(cursor_points, fill='white', outline='#333333')
    
    # Рисуем цифры (счетчик)
    try:
        font_size = int(size * 0.25)
        font = ImageFont.truetype("arial.ttf", font_size)
    except:
        font = ImageFont.load_default()
    
    text = "123"
    text_bbox = draw.textbbox((0, 0), text, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    text_height = text_bbox[3] - text_bbox[1]
    
    text_x = center_x + int(10 * scale) - text_width // 2
    text_y = center_y - int(25 * scale) - text_height // 2
    
    # Тень для текста
    draw.text((text_x + 1, text_y + 1), text, fill='#333333', font=font)
    draw.text((text_x, text_y), text, fill='white', font=font)
    
    # Сохраняем
    img.save(filename, 'PNG')
    print(f"✓ Создана иконка: {filename}")

# Создаем директорию если её нет
icons_dir = os.path.dirname(os.path.abspath(__file__))

# Генерируем иконки всех размеров
create_icon(16, os.path.join(icons_dir, 'icon16.png'))
create_icon(48, os.path.join(icons_dir, 'icon48.png'))
create_icon(128, os.path.join(icons_dir, 'icon128.png'))

print("\n✅ Все иконки успешно созданы!")
