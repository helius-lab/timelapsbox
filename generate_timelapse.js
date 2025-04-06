/**
 * Node.js script to generate a timelapse video from a series of JPG images
 * Requires ffmpeg to be installed on the system
 */
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

// Константы для настройки видео
const FRAME_RATE = 30; // кадров в секунду
const OUTPUT_FILENAME = `timelapse_${
  new Date().toISOString().split("T")[0]
}.mp4`;
const PHOTO_DIR = "./"; // директория с фотографиями (по умолчанию - текущая)
const PHOTO_PATTERN = "photo_*.jpg"; // шаблон для поиска снимков

/**
 * Создает видео из серии изображений с помощью ffmpeg
 */
function generateTimelapse() {
  console.log("Начинаем создание timelapse видео...");

  // Проверяем наличие ffmpeg
  exec("ffmpeg -version", (error) => {
    if (error) {
      console.error(
        "Ошибка: ffmpeg не обнаружен. Пожалуйста, установите ffmpeg."
      );
      console.error("https://ffmpeg.org/download.html");
      return;
    }

    // Получаем список всех файлов в директории
    fs.readdir(PHOTO_DIR, (err, files) => {
      if (err) {
        console.error("Ошибка при чтении директории:", err);
        return;
      }

      // Фильтруем только jpg файлы, соответствующие шаблону
      const photoRegex = new RegExp(PHOTO_PATTERN.replace("*", ".*"));
      const photoFiles = files.filter(
        (file) =>
          file.match(photoRegex) &&
          (file.toLowerCase().endsWith(".jpg") ||
            file.toLowerCase().endsWith(".jpeg"))
      );

      if (photoFiles.length === 0) {
        console.error(
          `Не найдено файлов, соответствующих шаблону ${PHOTO_PATTERN}`
        );
        return;
      }

      // Сортируем файлы по имени (по времени создания)
      photoFiles.sort();

      console.log(
        `Найдено ${photoFiles.length} изображений для создания видео.`
      );

      // Создаем временный файл со списком изображений для ffmpeg
      const listFilePath = path.join(PHOTO_DIR, "images_list.txt");
      const fileContent = photoFiles
        .map((file) => `file '${path.join(PHOTO_DIR, file)}'`)
        .join("\n");

      fs.writeFile(listFilePath, fileContent, (err) => {
        if (err) {
          console.error("Ошибка при создании списка файлов:", err);
          return;
        }

        // Формируем команду ffmpeg
        const ffmpegCmd = [
          "ffmpeg",
          "-y", // перезаписывать существующие файлы
          `-f concat`,
          `-safe 0`,
          `-i "${listFilePath}"`,
          `-framerate ${FRAME_RATE}`,
          "-c:v libx264",
          "-pix_fmt yuv420p",
          `-r ${FRAME_RATE}`,
          `-preset medium`,
          `-crf 23`, // качество видео (0-51, где 0 - лучшее)
          `"${OUTPUT_FILENAME}"`,
        ].join(" ");

        console.log(`Выполняем команду: ${ffmpegCmd}`);

        // Запускаем ffmpeg
        exec(ffmpegCmd, (error, stdout, stderr) => {
          // Удаляем временный файл со списком
          fs.unlink(listFilePath, () => {});

          if (error) {
            console.error("Ошибка при создании видео:", error);
            return;
          }

          console.log(`Видео успешно создано: ${OUTPUT_FILENAME}`);
          console.log(
            `Разрешение: ${photoFiles.length} кадров, ${FRAME_RATE} FPS`
          );
          console.log(
            `Продолжительность: ${photoFiles.length / FRAME_RATE} секунд`
          );
        });
      });
    });
  });
}

// Запускаем генерацию, если скрипт запущен напрямую
if (require.main === module) {
  generateTimelapse();
}

module.exports = { generateTimelapse };
