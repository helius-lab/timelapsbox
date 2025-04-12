/**
 * Module for capturing photo series in the TimelapseBox project
 */
const { log } = require("../utils/logger");
const fs = require("fs");
const path = require("path");
const {
  DATA_FOLDER,
  ensureFolderExists,
  createSessionFolderPath,
} = require("../utils/filesystem");
const { capturePhoto } = require("./camera");

// Default settings
const DEFAULT_SETTINGS = {
  totalTimeMinutes: 5, // Total shooting time in minutes
  totalPhotos: 24, // Total number of photos
};

/**
 * Removes a directory and all files in it
 * @param {string} dirPath - Path to directory to remove
 */
function removeDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach((file) => {
      const currentPath = path.join(dirPath, file);
      try {
        fs.unlinkSync(currentPath);
      } catch (err) {
        log(`Error removing file ${currentPath}: ${err.message}`, "ERROR");
      }
    });

    try {
      fs.rmdirSync(dirPath);
      log(`Removed temporary directory: ${dirPath}`, "SUCCESS");
    } catch (err) {
      log(`Error removing directory ${dirPath}: ${err.message}`, "ERROR");
    }
  }
}

/**
 * Captures a series of photos at calculated intervals
 * @param {Object} settings - Settings for the series
 * @param {number} settings.totalTimeMinutes - Total shooting time in minutes
 * @param {number} settings.totalPhotos - Total number of photos
 * @returns {Promise<Object>} - Object with session folder and captured photos
 */
async function captureSeries(settings = {}) {
  try {
    // Merge default settings with provided ones
    const config = {
      ...DEFAULT_SETTINGS,
      ...settings,
    };

    const { totalTimeMinutes, totalPhotos } = config;
    const intervalMs = (totalTimeMinutes * 60 * 1000) / totalPhotos;

    // Make sure data folder exists
    ensureFolderExists(DATA_FOLDER);

    // Create unique folder for the current series inside data folder
    const sessionFolder = createSessionFolderPath();

    log(`=== STARTING PHOTO SERIES ===`);
    log(`Settings:`);
    log(`- Number of photos: ${totalPhotos}`);
    log(`- Duration: ${totalTimeMinutes} minutes`);
    log(`- Interval: ${(intervalMs / 1000).toFixed(1)} seconds`);
    log(`- Output folder: ${sessionFolder}`);
    log(`- Storage: JPG and RAW files in separate folders`);

    let photosCount = 0;
    const startTime = Date.now();
    const capturedPhotos = {
      jpg: [],
      raw: [],
    };

    // Take first photo immediately
    try {
      const firstPhoto = await capturePhoto(sessionFolder);
      if (firstPhoto.jpg) capturedPhotos.jpg.push(firstPhoto.jpg);
      if (firstPhoto.raw) capturedPhotos.raw.push(firstPhoto.raw);
      photosCount++;
      log(
        `Progress: ${photosCount}/${totalPhotos} (${Math.round(
          (photosCount / totalPhotos) * 100
        )}%)`
      );
    } catch (error) {
      log(`Error capturing first frame: ${error}`, "ERROR");
    }

    // Return a promise that resolves when all photos are captured
    return new Promise((resolve, reject) => {
      // Set up interval shooting for remaining photos
      const intervalId = setInterval(async () => {
        // Check if we've exceeded time or photo limit
        const elapsed = Date.now() - startTime;
        const timeRemaining = totalTimeMinutes * 60 * 1000 - elapsed;
        const elapsedMinutes = (elapsed / 1000 / 60).toFixed(2);

        if (photosCount >= totalPhotos || timeRemaining <= 0) {
          clearInterval(intervalId);

          // Clean up temporary directory
          const tempDir = path.join(sessionFolder, "temp");
          removeDirectory(tempDir);

          log(`Series completed! Summary:`, "SUCCESS");
          log(`- Captured ${photosCount} photos out of ${totalPhotos}`);
          log(`- JPG files: ${capturedPhotos.jpg.length}`);
          log(`- RAW files: ${capturedPhotos.raw.length}`);
          log(`- Time elapsed: ${elapsedMinutes} minutes`);
          resolve({
            sessionFolder,
            capturedPhotos,
          });
          return;
        }

        try {
          const photo = await capturePhoto(sessionFolder);
          if (photo.jpg) capturedPhotos.jpg.push(photo.jpg);
          if (photo.raw) capturedPhotos.raw.push(photo.raw);
          photosCount++;

          // Calculate and display progress
          const percentComplete = Math.round((photosCount / totalPhotos) * 100);
          log(
            `Progress: ${photosCount}/${totalPhotos} (${percentComplete}%), elapsed time: ${elapsedMinutes} minutes`
          );
        } catch (error) {
          log(`Error capturing frame #${photosCount + 1}: ${error}`, "ERROR");
        }
      }, intervalMs);
    });
  } catch (error) {
    log(`Critical error in series capture: ${error}`, "ERROR");
    throw error;
  }
}

module.exports = { captureSeries, DEFAULT_SETTINGS };
