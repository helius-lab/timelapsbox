/**
 * Node.js script for capturing a series of photos using gphoto2
 * and creating a timelapse video using ffmpeg
 */
const { execFile, exec } = require("child_process");
const fs = require("fs");
const path = require("path");

// ====================== SETTINGS ======================
// Constants for shooting settings (can be modified as needed)
const TOTAL_TIME_MINUTES = 1; // Total shooting time in minutes
const TOTAL_PHOTOS = 12; // Total number of photos
const DATA_FOLDER = "data"; // Main folder for data storage
const FPS = 12; // Frames per second for timelapse
const VIDEO_QUALITY = 23; // Video quality (lower = better, range 0-51)

// Calculate interval between shots in milliseconds
const INTERVAL_MS = (TOTAL_TIME_MINUTES * 60 * 1000) / TOTAL_PHOTOS;

// ====================== HELPER FUNCTIONS ======================

/**
 * Formats current time for logs
 * @returns {string} Formatted time
 */
function getTimeStamp() {
  return new Date().toISOString().replace(/T/, " ").replace(/\..+/, "");
}

/**
 * Prints a message to console with timestamp
 * @param {string} message - Message to output
 * @param {string} [type='INFO'] - Message type (INFO, ERROR, SUCCESS)
 */
function log(message, type = "INFO") {
  const timestamp = getTimeStamp();
  let formattedMessage;

  switch (type.toUpperCase()) {
    case "ERROR":
      formattedMessage = `[${timestamp}] [ERROR] ${message}`;
      console.error(formattedMessage);
      break;
    case "SUCCESS":
      formattedMessage = `[${timestamp}] [SUCCESS] ${message}`;
      console.log(formattedMessage);
      break;
    default:
      formattedMessage = `[${timestamp}] [INFO] ${message}`;
      console.log(formattedMessage);
  }

  return formattedMessage;
}

/**
 * Creates a folder if it doesn't exist
 * @param {string} folderPath - path to folder
 */
function ensureFolderExists(folderPath) {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    log(`Folder created: ${folderPath}`, "SUCCESS");
  }
}

/**
 * Generates folder name based on current date and time
 * @returns {string} Path to folder for current series
 */
function createSessionFolderPath() {
  const now = new Date();
  // Create folder name in format series_YYYY-MM-DD_HH-MM-SS
  const folderName = `series_${now.getFullYear()}-${(now.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}_${now
    .getHours()
    .toString()
    .padStart(2, "0")}-${now.getMinutes().toString().padStart(2, "0")}-${now
    .getSeconds()
    .toString()
    .padStart(2, "0")}`;
  return path.join(DATA_FOLDER, folderName);
}

// ====================== MAIN FUNCTIONS ======================

/**
 * Takes a photo using gphoto2 and saves it with timestamp
 * @param {string} outputFolder - folder to save the photo
 * @returns {Promise<string>} Promise with path to saved file
 */
function capturePhoto(outputFolder) {
  return new Promise((resolve, reject) => {
    // Make sure output folder exists
    ensureFolderExists(outputFolder);

    // Create filename with current date and time
    const now = new Date();
    const timestamp = now
      .toISOString()
      .replace(/[-:]/g, "")
      .replace("T", "_")
      .replace(/\..+/, "");
    const filename = path.join(outputFolder, `photo_${timestamp}.jpg`);

    log(`Starting capture: ${filename}`);

    // Execute gphoto2 command to capture and download image
    execFile(
      "gphoto2",
      ["--capture-image-and-download", `--filename=${filename}`],
      (error, stdout, stderr) => {
        if (error) {
          log(`Error capturing image: ${stderr || error.message}`, "ERROR");
          reject(error);
          return;
        }
        log(`Photo saved: ${filename}`, "SUCCESS");
        resolve(filename);
      }
    );
  });
}

/**
 * Creates a timelapse video from a series of images
 * @param {string} folderPath - path to folder with images
 * @returns {Promise<string>} Promise with path to created video
 */
function createTimelapse(folderPath) {
  return new Promise((resolve, reject) => {
    const outputFile = path.join(folderPath, "timelapse.mp4");
    const inputPattern = path.join(folderPath, "photo_*.jpg");

    log(`Starting timelapse creation from photos: ${folderPath}`);

    // Parameters for ffmpeg:
    // -framerate: frame rate (FPS)
    // -pattern_type glob: use glob pattern to find files
    // -i: input file pattern
    // -c:v libx264: h.264 codec
    // -pix_fmt yuv420p: pixel format for better compatibility
    // -crf: video quality (lower value = higher quality)
    const command = `ffmpeg -framerate ${FPS} -pattern_type glob -i "${inputPattern}" -c:v libx264 -pix_fmt yuv420p -crf ${VIDEO_QUALITY} "${outputFile}"`;

    log(`Running command: ${command}`);

    exec(command, (error, stdout, stderr) => {
      if (error) {
        log(`Error creating timelapse: ${stderr || error.message}`, "ERROR");
        reject(error);
        return;
      }
      log(`Timelapse successfully created: ${outputFile}`, "SUCCESS");
      resolve(outputFile);
    });
  });
}

/**
 * Captures a series of photos at calculated intervals and creates a timelapse
 */
async function captureSeries() {
  try {
    // Make sure data folder exists
    ensureFolderExists(DATA_FOLDER);

    // Create unique folder for the current series inside data folder
    const sessionFolder = createSessionFolderPath();

    log(`=== STARTING PHOTO SERIES ===`);
    log(`Settings:`);
    log(`- Number of photos: ${TOTAL_PHOTOS}`);
    log(`- Duration: ${TOTAL_TIME_MINUTES} minutes`);
    log(`- Interval: ${(INTERVAL_MS / 1000).toFixed(1)} seconds`);
    log(`- Output folder: ${sessionFolder}`);
    log(`- Timelapse frame rate: ${FPS} fps`);
    log(`- Video quality: CRF ${VIDEO_QUALITY}`);

    let photosCount = 0;
    const startTime = Date.now();

    // Take first photo immediately
    try {
      await capturePhoto(sessionFolder);
      photosCount++;
      log(
        `Progress: ${photosCount}/${TOTAL_PHOTOS} (${Math.round(
          (photosCount / TOTAL_PHOTOS) * 100
        )}%)`
      );
    } catch (error) {
      log(`Error capturing first frame: ${error}`, "ERROR");
    }

    // Set up interval shooting for remaining photos
    const intervalId = setInterval(async () => {
      // Check if we've exceeded time or photo limit
      const elapsed = Date.now() - startTime;
      const timeRemaining = TOTAL_TIME_MINUTES * 60 * 1000 - elapsed;
      const elapsedMinutes = (elapsed / 1000 / 60).toFixed(2);

      if (photosCount >= TOTAL_PHOTOS || timeRemaining <= 0) {
        clearInterval(intervalId);
        log(`Series completed! Summary:`, "SUCCESS");
        log(`- Captured ${photosCount} photos out of ${TOTAL_PHOTOS}`);
        log(`- Time elapsed: ${elapsedMinutes} minutes`);

        // Create timelapse after shooting is complete
        try {
          log(`Starting timelapse creation...`);
          const timelapseFile = await createTimelapse(sessionFolder);
          log(`=== PROCESS COMPLETED ===`, "SUCCESS");
          log(`Timelapse available at: ${timelapseFile}`, "SUCCESS");
        } catch (error) {
          log(`Failed to create timelapse: ${error}`, "ERROR");
        }

        return;
      }

      try {
        await capturePhoto(sessionFolder);
        photosCount++;

        // Calculate and display progress
        const percentComplete = Math.round((photosCount / TOTAL_PHOTOS) * 100);
        log(
          `Progress: ${photosCount}/${TOTAL_PHOTOS} (${percentComplete}%), elapsed time: ${elapsedMinutes} minutes`
        );
      } catch (error) {
        log(`Error capturing frame #${photosCount + 1}: ${error}`, "ERROR");
      }
    }, INTERVAL_MS);
  } catch (error) {
    log(`Critical error: ${error}`, "ERROR");
  }
}

// Execute the function if script is run directly
if (require.main === module) {
  captureSeries().catch((err) => {
    log(`Unhandled error: ${err}`, "ERROR");
    process.exit(1);
  });
}

module.exports = { capturePhoto, captureSeries, createTimelapse };
