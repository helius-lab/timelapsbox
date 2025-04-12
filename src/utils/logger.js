/**
 * Utility module for logging in the TimelapseBox project
 */
const fs = require("fs");
const path = require("path");

// Global variable to store log file path
let logFilePath = null;

/**
 * Formats current time for logs
 * @returns {string} Formatted time
 */
function getTimeStamp() {
  return new Date().toISOString().replace(/T/, " ").replace(/\..+/, "");
}

/**
 * Sets the log file path for the current session
 * @param {string} sessionFolder - Path to the session folder
 */
function setLogFile(sessionFolder) {
  logFilePath = path.join(sessionFolder, "session_log.txt");

  // Write initial header to log file
  const timestamp = getTimeStamp();
  const header = `=== TIMELAPSEBOX SESSION LOG STARTED AT ${timestamp} ===\n`;
  fs.writeFileSync(logFilePath, header);

  return logFilePath;
}

/**
 * Prints a message to console with timestamp and optionally writes to log file
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

  // If log file is set, write to file
  if (logFilePath) {
    try {
      fs.appendFileSync(logFilePath, formattedMessage + "\n");
    } catch (error) {
      console.error(`Failed to write to log file: ${error.message}`);
    }
  }

  return formattedMessage;
}

module.exports = { getTimeStamp, log, setLogFile };
