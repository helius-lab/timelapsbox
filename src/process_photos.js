/**
 * Main script for processing photos in a series
 * Usage: node src/process_photos.js [directory]
 */
const path = require("path");
const fs = require("fs");
const { processPhotoSeries } = require("./processing/photo_processor");
const { log, setLogFile } = require("./utils/logger");
const {
  DATA_FOLDER,
  JPG_FOLDER,
  ensureFolderExists,
} = require("./utils/filesystem");

async function main() {
  try {
    // Parse command line arguments
    const args = process.argv.slice(2);
    let directory;

    if (args.length > 0) {
      directory = args[0];
    } else {
      // If no directory provided, try to find the most recent series
      const dataDirs = fs
        .readdirSync(DATA_FOLDER)
        .filter((dir) => dir.startsWith("series_"))
        .map((dir) => path.join(DATA_FOLDER, dir))
        .filter((dir) => fs.statSync(dir).isDirectory())
        .sort((a, b) => {
          return (
            fs.statSync(b).mtime.getTime() - fs.statSync(a).mtime.getTime()
          );
        });

      if (dataDirs.length === 0) {
        log("No series directories found in data folder", "ERROR");
        process.exit(1);
      }

      directory = dataDirs[0];
      log(`No directory specified, using most recent series: ${directory}`);
    }

    if (!fs.existsSync(directory)) {
      log(`Directory does not exist: ${directory}`, "ERROR");
      process.exit(1);
    }

    // Set the log file path to continue logging to the same file
    setLogFile(directory);
    log(`=== STARTING PHOTO PROCESSING ===`);

    // Check for the jpg subfolder
    const jpgFolder = path.join(directory, JPG_FOLDER);

    if (!fs.existsSync(jpgFolder)) {
      log(`JPG folder not found: ${jpgFolder}`, "ERROR");
      process.exit(1);
    }

    // Process photos in the jpg directory
    log(`Starting photo processing for directory: ${jpgFolder}`);
    const processedFiles = await processPhotoSeries(jpgFolder);
    log(
      `Photo processing completed! ${processedFiles.length} photos processed and saved to processed folder.`
    );
  } catch (error) {
    log(`Error in photo processing: ${error}`, "ERROR");
    process.exit(1);
  }
}

// Execute if script is run directly
if (require.main === module) {
  main();
}

module.exports = { main };
