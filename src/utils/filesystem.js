/**
 * Utility module for file system operations in the TimelapseBox project
 */
const fs = require("fs");
const path = require("path");
const { log } = require("./logger");

// Constants
const DATA_FOLDER = "data"; // Main folder for data storage

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

module.exports = { DATA_FOLDER, ensureFolderExists, createSessionFolderPath };
