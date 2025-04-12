/**
 * Utility module for logging in the TimelapseBox project
 */
const fs = require("fs");
const path = require("path");

// Global variables to store log file paths
let sessionLogPath = null;
let phaseLogPath = null;

/**
 * Formats current time for logs
 * @returns {string} Formatted time
 */
function getTimeStamp() {
  return new Date().toISOString().replace(/T/, " ").replace(/\..+/, "");
}

/**
 * Sets the log files for the current phase
 * @param {string} sessionFolder - Path to the session folder
 * @param {string} phase - Current phase ('capture', 'processing', 'timelapse')
 * @returns {Object} Paths to log files
 */
function setLogFile(sessionFolder, phase) {
  // Ensure session folder exists before writing
  if (!fs.existsSync(sessionFolder)) {
    console.error(
      `Cannot set log files: directory ${sessionFolder} does not exist`
    );
    try {
      fs.mkdirSync(sessionFolder, { recursive: true });
      console.log(`Created directory: ${sessionFolder}`);
    } catch (error) {
      console.error(`Failed to create directory: ${error.message}`);
      return { success: false };
    }
  }

  // Define log file paths
  sessionLogPath = path.join(sessionFolder, "session_log.txt");
  phaseLogPath = path.join(sessionFolder, `${phase}_log.txt`);

  const timestamp = getTimeStamp();

  // Initialize or append to session log file
  try {
    if (!fs.existsSync(sessionLogPath)) {
      // Create new session log if it doesn't exist
      const sessionHeader = `=== TIMELAPSEBOX SESSION LOG STARTED AT ${timestamp} ===\n`;
      fs.writeFileSync(sessionLogPath, sessionHeader);
    }
  } catch (error) {
    console.error(`Failed to initialize session log file: ${error.message}`);
    sessionLogPath = null;
  }

  // Create phase-specific log file
  try {
    const phaseHeader = `=== TIMELAPSEBOX ${phase.toUpperCase()} LOG STARTED AT ${timestamp} ===\n`;
    fs.writeFileSync(phaseLogPath, phaseHeader);
    console.log(`Phase log initialized: ${phaseLogPath}`);
  } catch (error) {
    console.error(`Failed to initialize phase log file: ${error.message}`);
    phaseLogPath = null;
  }

  return {
    success: true,
    sessionLogPath,
    phaseLogPath,
  };
}

/**
 * Prints a message to console with timestamp and writes to log files
 * @param {string} message - Message to output
 * @param {string} [type='INFO'] - Message type (INFO, ERROR, SUCCESS)
 * @returns {string} Formatted log message
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

  // Write to session log file if set
  if (sessionLogPath) {
    try {
      fs.appendFileSync(sessionLogPath, formattedMessage + "\n");
    } catch (error) {
      console.error(`Failed to write to session log file: ${error.message}`);
    }
  }

  // Write to phase log file if set
  if (phaseLogPath) {
    try {
      fs.appendFileSync(phaseLogPath, formattedMessage + "\n");
    } catch (error) {
      console.error(`Failed to write to phase log file: ${error.message}`);
    }
  }

  return formattedMessage;
}

module.exports = { getTimeStamp, log, setLogFile };
