/**
 * Main script for creating a timelapse from processed photos
 * Usage: node src/create_timelapse.js [directory] [fps] [quality]
 */
const path = require("path");
const fs = require("fs");
const {
  createTimelapse,
  DEFAULT_SETTINGS,
} = require("./processing/timelapse_creator");
const { log } = require("./utils/logger");
const { DATA_FOLDER } = require("./utils/filesystem");

async function main() {
  try {
    // Parse command line arguments
    const args = process.argv.slice(2);
    let directory;
    const options = { ...DEFAULT_SETTINGS };

    // Parse directory argument
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

    // Parse fps argument
    if (args.length > 1) {
      options.fps = parseInt(args[1], 10);
    }

    // Parse quality argument
    if (args.length > 2) {
      options.videoQuality = parseInt(args[2], 10);
    }

    if (!fs.existsSync(directory)) {
      log(`Directory does not exist: ${directory}`, "ERROR");
      process.exit(1);
    }

    // Check the jpg subfolder for processed photos
    const jpgFolder = path.join(directory, "jpg");

    if (!fs.existsSync(jpgFolder)) {
      log(`JPG folder does not exist: ${jpgFolder}`, "ERROR");
      process.exit(1);
    }

    // Check if processed photos exist in jpg folder
    const processedFiles = fs
      .readdirSync(jpgFolder)
      .filter(
        (file) =>
          file.startsWith("processed_") && file.toLowerCase().endsWith(".jpg")
      );

    // If no processed files found, try to find original jpg files
    if (processedFiles.length === 0) {
      const originalFiles = fs
        .readdirSync(jpgFolder)
        .filter((file) => file.toLowerCase().endsWith(".jpg"));

      if (originalFiles.length === 0) {
        log(`No JPG photos found in directory: ${jpgFolder}`, "ERROR");
        log("Make sure to run capture:series first", "ERROR");
        process.exit(1);
      }

      log(
        `No processed photos found, using ${originalFiles.length} original photos`
      );

      // Set the input pattern to use original jpg files
      options.inputPattern = path.join(jpgFolder, "*.jpg");
    } else {
      log(`Found ${processedFiles.length} processed photos in ${jpgFolder}`);
      options.inputPattern = path.join(jpgFolder, "processed_*.jpg");
    }

    // Create timelapse from jpg photos
    log(`Starting timelapse creation from photos in: ${jpgFolder}`);
    const outputFile = await createTimelapse(directory, options);
    log(
      `Timelapse creation completed! Video saved to: ${outputFile}`,
      "SUCCESS"
    );
  } catch (error) {
    log(`Error in timelapse creation: ${error}`, "ERROR");
    process.exit(1);
  }
}

// Execute if script is run directly
if (require.main === module) {
  main();
}

module.exports = { main };
