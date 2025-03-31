import subprocess
import datetime

def capture_photo():
    # Формируем имя файла с текущей датой и временем
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"photo_{timestamp}.jpg"
    
    # Выполняем команду gPhoto2 для захвата снимка и автоматического скачивания
    command = ["gphoto2", "--capture-image-and-download", f"--filename={filename}"]
    result = subprocess.run(command, capture_output=True, text=True)
    
    # Проверяем, успешно ли выполнена команда
    if result.returncode == 0:
        print(f"Снимок сохранён как {filename}")
    else:
        print("Ошибка при захвате изображения:")
        print(result.stderr)

if __name__ == "__main__":
    capture_photo()