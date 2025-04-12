/**
 * Utility script for viewing session logs
 * Usage: node src/utils/view_logs.js [session_directory]
 */
const fs = require("fs");
const path = require("path");
const { DATA_FOLDER } = require("./filesystem");

function findLogFile(sessionDir) {
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

  const logFile = path.join(sessionDir, "session_log.txt");

  if (!fs.existsSync(logFile)) {
    console.error(`No log file found at: ${logFile}`);
    process.exit(1);
  }

  return logFile;
}

function displayLog(logFile) {
  try {
    const logContent = fs.readFileSync(logFile, "utf8");
    console.log("\n=== SESSION LOG CONTENTS ===\n");
    console.log(logContent);
    console.log("\n=== END OF LOG ===\n");
  } catch (error) {
    console.error(`Error reading log file: ${error.message}`);
    process.exit(1);
  }
}

function main() {
  const args = process.argv.slice(2);
  const sessionDir = args[0];

  const logFile = findLogFile(sessionDir);
  console.log(`Reading log file: ${logFile}`);
  displayLog(logFile);
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { findLogFile, displayLog };
