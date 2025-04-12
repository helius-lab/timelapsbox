/**
 * Main script for capturing a series of photos
 * Usage: node src/capture_photos.js [totalTimeMinutes] [totalPhotos]
 */
const { captureSeries } = require("./capture/series_capture");
const { log } = require("./utils/logger");
const fs = require("fs");
const path = require("path");

async function main() {
  try {
    // Parse command line arguments
    const args = process.argv.slice(2);
    const settings = {};

    if (args.length > 0) {
      settings.totalTimeMinutes = parseFloat(args[0]);
    }

    if (args.length > 1) {
      settings.totalPhotos = parseInt(args[1], 10);
    }

    // Start capturing series
    log("Starting photo capture process...");
    const result = await captureSeries(settings);
    log(
      `Photo series capture completed. Photos saved to: ${result.sessionFolder}`
    );
    log(`JPG files captured: ${result.capturedPhotos.jpg.length}`);
    log(`RAW files captured: ${result.capturedPhotos.raw.length}`);

    // Check if camera config file exists
    const configFile = path.join(result.sessionFolder, "camera_config.txt");
    if (fs.existsSync(configFile)) {
      const stats = fs.statSync(configFile);
      log(
        `Camera configuration file found: ${configFile} (${stats.size} bytes)`,
        "SUCCESS"
      );
    } else {
      log(`Camera configuration file NOT found at: ${configFile}`, "ERROR");
      log(
        "Make sure your camera is connected and recognized by gphoto2",
        "ERROR"
      );
      log(
        "Try running 'gphoto2 --list-all-config' manually to check camera connection",
        "INFO"
      );
    }
  } catch (error) {
    log(`Error in capture photos process: ${error}`, "ERROR");
    process.exit(1);
  }
}

// Execute if script is run directly
if (require.main === module) {
  main();
}

module.exports = { main };
