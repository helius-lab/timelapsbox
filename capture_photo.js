/**
 * Node.js script to capture a photo using gphoto2
 */
const { execFile } = require("child_process");

/**
 * Captures a photo using gphoto2 and saves it with timestamp
 */
function capturePhoto() {
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
        return;
      }
      console.log(`Снимок сохранён как ${filename}`);
    }
  );
}

// Execute the function if script is run directly
if (require.main === module) {
  capturePhoto();
}

module.exports = { capturePhoto };
