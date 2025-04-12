/**
 * Module for processing photos in the TimelapseBox project
 */
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { log } = require("../utils/logger");
const { ensureFolderExists, PROCESSED_FOLDER } = require("../utils/filesystem");

/**
 * Process a single photo using external tools (placeholder for implementation)
 * @param {string} photoPath - Path to the photo to process
 * @param {Object} options - Processing options
 * @returns {Promise<string>} - Path to the processed photo
 */
function processPhoto(photoPath, options = {}) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(photoPath)) {
      reject(new Error(`Photo file not found: ${photoPath}`));
      return;
    }

    // Get the file's directory, name, and parent directory (session folder)
    const dir = path.dirname(photoPath);
    const sessionDir = path.dirname(dir);
    const filename = path.basename(photoPath);

    // Create processed directory if it doesn't exist
    const processedDir = path.join(sessionDir, PROCESSED_FOLDER);
    ensureFolderExists(processedDir);

    // Create processed variant name
    const processedFilename = `processed_${filename}`;
    const outputPath = path.join(processedDir, processedFilename);

    log(`Processing photo: ${photoPath}`);

    // For now, create a copy of the original file as placeholder
    // In a real implementation, this would apply filters, adjustments, etc.
    fs.copyFile(photoPath, outputPath, (err) => {
      if (err) {
        log(`Error processing photo: ${err.message}`, "ERROR");
        reject(err);
        return;
      }

      log(`Photo processed and saved to: ${outputPath}`, "SUCCESS");
      resolve(outputPath);
    });
  });
}

/**
 * Process a series of photos in a directory
 * @param {string} directory - Directory containing photos to process
 * @param {Object} options - Processing options
 * @returns {Promise<Array<string>>} - Paths to processed photos
 */
async function processPhotoSeries(directory, options = {}) {
  return new Promise((resolve, reject) => {
    log(`Processing photo series in directory: ${directory}`);

    // Get all the JPG files in the directory
    const files = fs
      .readdirSync(directory)
      .filter(
        (file) =>
          file.toLowerCase().endsWith(".jpg") && !file.startsWith("processed_")
      )
      .map((file) => path.join(directory, file))
      .sort();

    if (files.length === 0) {
      log(`No photos found in directory: ${directory}`, "ERROR");
      reject(new Error("No photos found"));
      return;
    }

    log(`Found ${files.length} photos to process`);

    // Process each photo sequentially
    const processedFiles = [];

    const processNext = (index) => {
      if (index >= files.length) {
        log(`All photos processed successfully`, "SUCCESS");
        resolve(processedFiles);
        return;
      }

      processPhoto(files[index], options)
        .then((processedPath) => {
          processedFiles.push(processedPath);
          log(
            `Progress: ${processedFiles.length}/${files.length} photos processed`
          );
          processNext(index + 1);
        })
        .catch((err) => {
          log(`Error processing photo #${index + 1}: ${err.message}`, "ERROR");
          processNext(index + 1);
        });
    };

    processNext(0);
  });
}

module.exports = { processPhoto, processPhotoSeries };
