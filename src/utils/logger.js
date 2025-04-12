/**
 * Utility module for logging in the TimelapseBox project
 */

/**
 * Formats current time for logs
 * @returns {string} Formatted time
 */
function getTimeStamp() {
  return new Date().toISOString().replace(/T/, " ").replace(/\..+/, "");
}

/**
 * Prints a message to console with timestamp
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

  return formattedMessage;
}

module.exports = { getTimeStamp, log };
