/**
 * Module for creating timelapse videos in the TimelapseBox project
 */
const path = require("path");
const { spawn } = require("child_process");
const { log } = require("../utils/logger");
const { ensureFolderExists, OUTPUT_FOLDER } = require("../utils/filesystem");

// Default settings for timelapse creation
const DEFAULT_SETTINGS = {
  fps: 24, // Frames per second for timelapse
  videoQuality: 11, // Video quality (lower = better, range 0-51)
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

    // Create output directory - use custom if provided in options, otherwise default
    let outputDir;
    if (config.outputFolder) {
      outputDir = config.outputFolder;
    } else {
      outputDir = path.join(sourceDir, OUTPUT_FOLDER);
    }

    ensureFolderExists(outputDir);

    // Default input pattern looks for processed images in the processed folder
    const inputPattern =
      config.inputPattern ||
      path.join(sourceDir, "processed", "processed_*.jpg");

    const outputFile = path.join(outputDir, outputFilename);

    log(`Starting timelapse creation from photos in: ${sourceDir}`);
    log(`Settings:`);
    log(`- Frame rate: ${fps} fps`);
    log(`- Video quality: CRF ${videoQuality}`);
    log(`- Output file: ${outputFile}`);

    //const command = `ffmpeg -y -framerate ${fps} -pattern_type glob -i "${inputPattern}" -vf "scale=1920:1080,deshake,hqdn3d=1.5:1.5:6:6,deflicker,minterpolate='fps=${fps * 2}:mi_mode=mci:mc_mode=aobmc:vsbmc=1',fps=${fps},eq=brightness=0:contrast=1.2:saturation=1.3:gamma=1:gamma_r=0.9:gamma_g=1.0:gamma_b=1.2,format=yuv420p" -c:v libx264 -preset slow -tune film -crf ${videoQuality} "${outputFile}"`;

    // Define video filters with clear variable name
    const videoFilters = [
      "deshake",
      "hqdn3d=1.5:1.5:6:6",
      "deflicker", // Remove flickering
      `minterpolate=fps=${
        fps * 2
      }:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1`, // Motion interpolation
      `fps=${fps}`, // Ensure consistent framerate
      "eq=brightness=-0.15:contrast=1.1:saturation=1.5:gamma=1:gamma_r=0.9:gamma_g=1.0:gamma_b=1.2", // Color/exposure adjustment
      "format=yuv420p", // Pixel format for compatibility
    ].join(",");

    // Organize ffmpeg arguments by purpose
    const args = [
      // Input options
      "-y", // Overwrite output without asking
      "-framerate",
      `${fps}`, // Input framerate
      "-pattern_type",
      "glob", // Use glob pattern for input files
      "-i",
      inputPattern, // Input file pattern

      // Video processing
      "-vf",
      videoFilters, // Apply video filters

      // Output encoding
      "-c:v",
      "libx264", // H.264 video codec
      "-preset",
      "slow", // Encoding speed/quality balance
      "-tune",
      "film", // Optimize for film content
      "-crf",
      `${videoQuality}`, // Constant Rate Factor (quality)

      // Output file
      outputFile, // Destination file
    ];

    log(`Running ffmpeg with the following configuration:`);
    log(`- Input: ${inputPattern}`);
    log(`- Filters: ${videoFilters}`);
    log(`- Output: ${outputFile}`);

    const ffmpegProcess = spawn("ffmpeg", args);

    let stderr = "";

    ffmpegProcess.stderr.on("data", (data) => {
      stderr += data.toString();
      // Optionally log progress here
    });

    ffmpegProcess.on("close", (code) => {
      if (code !== 0) {
        log(`Error creating timelapse: ${stderr}`, "ERROR");
        reject(new Error(`ffmpeg exited with code ${code}`));
        return;
      }
      log(`Timelapse successfully created: ${outputFile}`, "SUCCESS");
      resolve(outputFile);
    });
  });
}

module.exports = { createTimelapse, DEFAULT_SETTINGS };
