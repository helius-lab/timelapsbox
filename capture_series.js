/**
 * Node.js script to capture a series of photos using gphoto2
 */
const { execFile } = require("child_process");

// Константы для настройки съемки
const TOTAL_TIME_MINUTES = 1; // общее время съемки в минутах (t)
const TOTAL_PHOTOS = 10; // общее количество снимков (N)

// Рассчитываем интервал между снимками в миллисекундах
const INTERVAL_MS = (TOTAL_TIME_MINUTES * 60 * 1000) / TOTAL_PHOTOS;

/**
 * Captures a photo using gphoto2 and saves it with timestamp
 * @returns {Promise} Promise that resolves when photo is captured
 */
function capturePhoto() {
  return new Promise((resolve, reject) => {
    // Create filename with current date and time
    const now = new Date();
    const timestamp = now
      .toISOString()
      .replace(/[-:]/g, "")
      .replace("T", "_")
      .replace(/\..+/, "");
    const filename = `photo_${timestamp}.jpg`;

    // Execute gphoto2 command to capture and download image
    execFile(
      "gphoto2",
      ["--capture-image-and-download", `--filename=${filename}`],
      (error, stdout, stderr) => {
        if (error) {
          console.log("Ошибка при захвате изображения:");
          console.log(stderr || error.message);
          reject(error);
          return;
        }
        console.log(`Снимок сохранён как ${filename}`);
        resolve(filename);
      }
    );
  });
}

/**
 * Captures a series of photos at calculated intervals
 */
async function captureSeries() {
  console.log(
    `Начинаем серию съемки: ${TOTAL_PHOTOS} снимков за ${TOTAL_TIME_MINUTES} минут`
  );
  console.log(`Интервал между снимками: ${INTERVAL_MS / 1000} секунд`);

  let photosCount = 0;
  const startTime = Date.now();

  // Делаем первый снимок сразу
  try {
    await capturePhoto();
    photosCount++;
    console.log(`Сделано ${photosCount} из ${TOTAL_PHOTOS} снимков`);
  } catch (error) {
    console.error("Ошибка при съемке:", error);
  }

  // Настраиваем интервальную съемку для оставшихся фотографий
  const intervalId = setInterval(async () => {
    // Проверяем, не превысили ли мы лимит по времени или количеству снимков
    const elapsed = Date.now() - startTime;
    const timeRemaining = TOTAL_TIME_MINUTES * 60 * 1000 - elapsed;

    if (photosCount >= TOTAL_PHOTOS || timeRemaining <= 0) {
      clearInterval(intervalId);
      console.log(
        `Серия завершена. Сделано ${photosCount} снимков за ${
          elapsed / 1000 / 60
        } минут`
      );
      return;
    }

    try {
      await capturePhoto();
      photosCount++;
      console.log(
        `Сделано ${photosCount} из ${TOTAL_PHOTOS} снимков, прошло ${
          elapsed / 1000 / 60
        } минут`
      );
    } catch (error) {
      console.error("Ошибка при съемке:", error);
    }
  }, INTERVAL_MS);
}

// Execute the function if script is run directly
if (require.main === module) {
  captureSeries();
}

module.exports = { capturePhoto, captureSeries };
