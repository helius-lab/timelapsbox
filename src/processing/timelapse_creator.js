/**
 * Module for creating timelapse videos in the TimelapseBox project
 */
const path = require("path");
const { exec } = require("child_process");
const { log } = require("../utils/logger");

// Default settings for timelapse creation
const DEFAULT_SETTINGS = {
  fps: 24, // Frames per second for timelapse
  videoQuality: 23, // Video quality (lower = better, range 0-51)
  outputFilename: "timelapse.mp4", // Default output filename
};

/**
 * Creates a timelapse video from a series of images
 * @param {string} sourceDir - Directory containing processed images
 * @param {Object} options - Options for timelapse creation
 * @param {number} options.fps - Frames per second
 * @param {number} options.videoQuality - Video quality (CRF value)
 * @param {string} options.outputFilename - Custom output filename
 * @param {string} options.inputPattern - Custom pattern for input files
 * @returns {Promise<string>} - Path to created video file
 */
function createTimelapse(sourceDir, options = {}) {
  return new Promise((resolve, reject) => {
    // Merge default settings with provided ones
    const config = {
      ...DEFAULT_SETTINGS,
      ...options,
    };

    const { fps, videoQuality, outputFilename } = config;

    // Default input pattern looks for processed images
    const inputPattern =
      config.inputPattern || path.join(sourceDir, "processed_*.jpg");

    const outputFile = path.join(sourceDir, outputFilename);

    log(`Starting timelapse creation from photos in: ${sourceDir}`);
    log(`Settings:`);
    log(`- Frame rate: ${fps} fps`);
    log(`- Video quality: CRF ${videoQuality}`);
    log(`- Output file: ${outputFile}`);

    // Parameters for ffmpeg:
    // -framerate: frame rate (FPS)
    // -pattern_type glob: use glob pattern to find files
    // -i: input file pattern
    // -c:v libx264: h.264 codec
    // -pix_fmt yuv420p: pixel format for better compatibility
    // -crf: video quality (lower value = higher quality)
    const command = `ffmpeg -framerate ${fps} -pattern_type glob -i "${inputPattern}" -c:v libx264 -pix_fmt yuv420p -crf ${videoQuality} "${outputFile}"`;

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

module.exports = { createTimelapse, DEFAULT_SETTINGS };
