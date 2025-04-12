/**
 * Utility script for viewing session logs
 * Usage: node src/utils/view_logs.js [session_directory] [log_type]
 * log_type options: session, capture, processing, timelapse, all (default: session)
 */
const fs = require("fs");
const path = require("path");
const { DATA_FOLDER } = require("./filesystem");

/**
 * Finds the log files in a session directory
 * @param {string} sessionDir - Session directory path
 * @returns {Object} Object with paths to log files
 */
function findLogFiles(sessionDir) {
  if (!sessionDir) {
    // Find the most recent session directory
    const dataDirs = fs
      .readdirSync(DATA_FOLDER)
      .filter((dir) => dir.startsWith("series_"))
      .map((dir) => path.join(DATA_FOLDER, dir))
      .filter((dir) => fs.statSync(dir).isDirectory())
      .sort((a, b) => {
        return fs.statSync(b).mtime.getTime() - fs.statSync(a).mtime.getTime();
      });

    if (dataDirs.length === 0) {
      console.error("No session directories found in data folder");
      process.exit(1);
    }

    sessionDir = dataDirs[0];
    console.log(
      `No directory specified, using most recent session: ${sessionDir}`
    );
  }

  const logFiles = {
    session: path.join(sessionDir, "session_log.txt"),
    capture: path.join(sessionDir, "capture_log.txt"),
    processing: path.join(sessionDir, "processing_log.txt"),
    timelapse: path.join(sessionDir, "timelapse_log.txt"),
  };

  // Check which log files exist
  const existingLogs = Object.entries(logFiles)
    .filter(([_, filePath]) => fs.existsSync(filePath))
    .reduce((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {});

  if (Object.keys(existingLogs).length === 0) {
    console.error(`No log files found in directory: ${sessionDir}`);
    process.exit(1);
  }

  return { sessionDir, logFiles: existingLogs };
}

/**
 * Displays log file content
 * @param {string} logFile - Path to log file
 * @param {string} logType - Type of log
 */
function displayLog(logFile, logType) {
  try {
    const logContent = fs.readFileSync(logFile, "utf8");
    console.log(`\n=== ${logType.toUpperCase()} LOG CONTENTS ===\n`);
    console.log(logContent);
    console.log(`\n=== END OF ${logType.toUpperCase()} LOG ===\n`);
  } catch (error) {
    console.error(`Error reading log file: ${error.message}`);
  }
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);
  const sessionDir = args[0];
  const logType = args[1] || "session";

  const { sessionDir: dir, logFiles } = findLogFiles(sessionDir);

  console.log(`Available log files in ${dir}:`);
  Object.entries(logFiles).forEach(([type, file]) => {
    const stats = fs.statSync(file);
    console.log(`- ${type}: ${file} (${stats.size} bytes)`);
  });

  if (logType.toLowerCase() === "all") {
    // Display all available logs
    Object.entries(logFiles).forEach(([type, file]) => {
      displayLog(file, type);
    });
  } else if (logFiles[logType]) {
    // Display specific log
    displayLog(logFiles[logType], logType);
  } else {
    console.error(
      `Log type '${logType}' not found. Available types: ${Object.keys(
        logFiles
      ).join(", ")}`
    );
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { findLogFiles, displayLog };
