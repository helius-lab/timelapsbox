/**
 * Module for camera operations in the TimelapseBox project
 */
const { execFile } = require("child_process");
const path = require("path");
const fs = require("fs");
const { log } = require("../utils/logger");
const {
  ensureFolderExists,
  JPG_FOLDER,
  RAW_FOLDER,
  TEMP_FOLDER,
} = require("../utils/filesystem");

/**
 * Takes a photo using gphoto2 and saves both JPG and RAW (CR2) files
 * @param {string} outputFolder - base folder to save the photos
 * @returns {Promise<Object>} Promise with paths to saved files
 */
function capturePhoto(outputFolder) {
  return new Promise((resolve, reject) => {
    // Make sure base output folder exists
    ensureFolderExists(outputFolder);

    // Create separate folders for JPG and RAW files
    const jpgFolder = path.join(outputFolder, JPG_FOLDER);
    const rawFolder = path.join(outputFolder, RAW_FOLDER);
    ensureFolderExists(jpgFolder);
    ensureFolderExists(rawFolder);

    // Create filename base with current date and time
    const now = new Date();
    const timestamp = now
      .toISOString()
      .replace(/[-:]/g, "")
      .replace("T", "_")
      .replace(/\..+/, "");
    const filenameBase = `photo_${timestamp}`;

    // Path for temporary file capture
    const tempDir = path.join(outputFolder, TEMP_FOLDER);
    ensureFolderExists(tempDir);
    const capturePattern = path.join(tempDir, "capt%04n.%C");

    log(`Starting capture: ${filenameBase}`);

    // Execute gphoto2 command to capture and download both image formats
    execFile(
      "gphoto2",
      ["--capture-image-and-download", `--filename=${capturePattern}`],
      (error, stdout, stderr) => {
        if (error) {
          log(`Error capturing image: ${stderr || error.message}`, "ERROR");
          reject(error);
          return;
        }

        // Read the temporary directory to find captured files
        const capturedFiles = fs.readdirSync(tempDir);
        const jpgFiles = capturedFiles.filter((file) =>
          file.toLowerCase().endsWith(".jpg")
        );
        const rawFiles = capturedFiles.filter((file) =>
          file.toLowerCase().endsWith(".cr2")
        );

        const jpgPath =
          jpgFiles.length > 0
            ? path.join(jpgFolder, `${filenameBase}.jpg`)
            : null;
        const rawPath =
          rawFiles.length > 0
            ? path.join(rawFolder, `${filenameBase}.cr2`)
            : null;

        // Move files to their respective folders
        let filesFound = false;

        if (jpgFiles.length > 0) {
          fs.renameSync(path.join(tempDir, jpgFiles[0]), jpgPath);
          log(`JPG saved: ${jpgPath}`, "SUCCESS");
          filesFound = true;
        }

        if (rawFiles.length > 0) {
          fs.renameSync(path.join(tempDir, rawFiles[0]), rawPath);
          log(`RAW saved: ${rawPath}`, "SUCCESS");
          filesFound = true;
        }

        if (!filesFound) {
          log("No files were captured by the camera", "ERROR");
          reject(new Error("No files captured"));
          return;
        }

        // Return object with paths to both files
        resolve({
          jpg: jpgPath,
          raw: rawPath,
        });
      }
    );
  });
}

module.exports = { capturePhoto };
