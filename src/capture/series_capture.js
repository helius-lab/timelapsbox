/**
 * Module for capturing photo series in the TimelapseBox project
 */
const { log, setLogFile } = require("../utils/logger");
const fs = require("fs");
const path = require("path");
const { execFile } = require("child_process");
const {
  DATA_FOLDER,
  TEMP_FOLDER,
  ensureFolderExists,
  createSessionFolderPath,
} = require("../utils/filesystem");
const { capturePhoto } = require("./camera");

// Default settings
const DEFAULT_SETTINGS = {
  totalTimeMinutes: 10, // Total shooting time in minutes
  totalPhotos: 6 * 10, // Total number of photos
};

/**
 * Saves camera configuration to a file
 * @param {string} outputPath - Path to save the configuration
 * @returns {Promise<string>} - Path to the configuration file
 */
function saveCameraConfig(outputPath) {
  return new Promise((resolve, reject) => {
    // Make sure the output path exists
    ensureFolderExists(outputPath);

    const configFile = path.join(outputPath, "camera_config.txt");
    log(`Saving camera configuration to: ${configFile}`, "INFO");

    // First try to create a test file to ensure path and permissions are valid
    try {
      const testFile = path.join(outputPath, "test_write.txt");
      fs.writeFileSync(testFile, "Test write permissions");
      log(`Successfully created test file at: ${testFile}`, "SUCCESS");

      // Remove test file
      fs.unlinkSync(testFile);
    } catch (fsError) {
      log(
        `⚠️ Error writing test file: ${fsError.message}. Check path and permissions.`,
        "ERROR"
      );
      // Continue anyway to try the actual config save
    }

    // Try the primary method using --list-all-config
    try {
      log(`Method 1: Executing gphoto2 --list-all-config command...`, "INFO");
      execFile("gphoto2", ["--list-all-config"], (error, stdout, stderr) => {
        if (error || !stdout || stdout.trim() === "") {
          log(
            `Method 1 failed: ${error ? error.message : "Empty output"}`,
            "ERROR"
          );

          // Try alternative method using --list-config
          log(`Method 2: Trying gphoto2 --list-config instead...`, "INFO");
          execFile("gphoto2", ["--list-config"], (error2, stdout2, stderr2) => {
            if (error2 || !stdout2 || stdout2.trim() === "") {
              log(
                `Method 2 failed as well: ${
                  error2 ? error2.message : "Empty output"
                }`,
                "ERROR"
              );

              // Try the most direct approach as a last resort
              log(`Method 3: Trying direct shell command...`, "INFO");

              const shellCmd = `gphoto2 --list-all-config > "${configFile}"`;
              require("child_process").exec(
                shellCmd,
                (error3, stdout3, stderr3) => {
                  if (error3) {
                    log(
                      `All methods failed. Last error: ${error3.message}`,
                      "ERROR"
                    );
                    reject(
                      new Error("All camera config saving methods failed")
                    );
                    return;
                  }

                  if (fs.existsSync(configFile)) {
                    const stats = fs.statSync(configFile);
                    log(
                      `Method 3 succeeded: ${configFile} (${stats.size} bytes)`,
                      "SUCCESS"
                    );
                    resolve(configFile);
                  } else {
                    log(`Method 3 failed: File not created`, "ERROR");
                    reject(new Error("Could not save camera configuration"));
                  }
                }
              );
              return;
            }

            // Second method succeeded
            log(
              `Method 2 succeeded (${stdout2.length} bytes). Writing to file...`,
              "SUCCESS"
            );
            fs.writeFile(configFile, stdout2, (err) => {
              if (err) {
                log(
                  `Error writing configuration file: ${err.message}`,
                  "ERROR"
                );
                reject(err);
                return;
              }

              if (fs.existsSync(configFile)) {
                const stats = fs.statSync(configFile);
                log(
                  `Camera configuration saved: ${configFile} (${stats.size} bytes)`,
                  "SUCCESS"
                );
                resolve(configFile);
              } else {
                log(`File not created despite successful write`, "ERROR");
                reject(new Error("File not created"));
              }
            });
          });
          return;
        }

        // First method succeeded
        log(
          `Method 1 succeeded (${stdout.length} bytes). Writing to file...`,
          "SUCCESS"
        );
        fs.writeFile(configFile, stdout, (err) => {
          if (err) {
            log(`Error writing configuration file: ${err.message}`, "ERROR");
            reject(err);
            return;
          }

          // Verify the file was created
          if (fs.existsSync(configFile)) {
            const stats = fs.statSync(configFile);
            log(
              `Camera configuration saved: ${configFile} (${stats.size} bytes)`,
              "SUCCESS"
            );
            resolve(configFile);
          } else {
            log(`File not created despite successful write`, "ERROR");
            reject(new Error("File not created"));
          }
        });
      });
    } catch (execError) {
      log(`Exception executing gphoto2: ${execError.message}`, "ERROR");
      reject(execError);
    }
  });
}

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

    // Make sure the session folder exists before setting up log file
    ensureFolderExists(sessionFolder);

    // Initialize log file for the session
    setLogFile(sessionFolder, "capture");

    log(`=== STARTING PHOTO SERIES ===`);
    log(`Settings:`);
    log(`- Number of photos: ${totalPhotos}`);
    log(`- Duration: ${totalTimeMinutes} minutes`);
    log(`- Interval: ${(intervalMs / 1000).toFixed(1)} seconds`);
    log(`- Output folder: ${sessionFolder}`);
    log(`- Storage: JPG and RAW files in separate folders`);

    // Save camera configuration before starting capture
    try {
      await saveCameraConfig(sessionFolder);
    } catch (error) {
      log(`Warning: Could not save camera configuration: ${error}`, "ERROR");
      // Continue with capture even if config saving fails
    }

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
          const tempDir = path.join(sessionFolder, TEMP_FOLDER);
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
