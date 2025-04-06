# Roadmap for TimelapseBox System Development

## 1. Photography Automation ✅

### Completed Tasks:

- ✅ Automatically initiate shooting at specified intervals
- ✅ Save photos with timestamp-based filenames
- ✅ Log processes and errors with detailed timestamping
- ✅ Configure shooting parameters (interval, total time)

### Implementation Details:

- **Node.js capture script:**  
  Created `capture_series.js` script that automates photo capture using gphoto2
- **Interval shooting:**
  Implemented using JavaScript `setInterval()` function with configurable parameters
- **Structured logging:**
  Added comprehensive logging system with timestamps and message categorization

## 2. Photo Storage Organization ✅

### Completed Tasks:

- ✅ Save photos in date-based folder structure
- ✅ Create unique session folders for each capture series
- ✅ Ensure proper folder creation and error handling

### Implementation Details:

- **Folder structure:**  
  Implemented hierarchical storage:

  ```
  /data/series_YYYY-MM-DD_HH-MM-SS/photo_YYYYMMDD_HHMMSS.jpg
  ```

- **Automatic folder creation:**  
  Added folder verification/creation before saving photos
- **Session isolation:**
  Each capture series creates a new timestamped folder

## 3. Time-lapse Video Generation ✅

### Completed Tasks:

- ✅ Automatically create time-lapse videos from photo sequences
- ✅ Configure video parameters (FPS, codec, quality)
- ✅ Integrate video creation with capture workflow

### Implementation Details:

- **ffmpeg integration:**  
  Added direct ffmpeg execution from Node.js with customizable parameters:
  ```javascript
  const command = `ffmpeg -framerate ${FPS} -pattern_type glob -i "${inputPattern}" -c:v libx264 -pix_fmt yuv420p -crf ${VIDEO_QUALITY} "${outputFile}"`;
  ```
- **Automatic processing:**  
  Timelapse is automatically generated at the end of each capture series
- **Configurable quality:**
  Added settings for frame rate and video quality

## 4. Local Web Server and Interface

### Planned Tasks:

- Create a simple interface for viewing the photo gallery and generated timelapses
- Provide control capabilities (start/stop shooting, view status, watch videos)
- Display system status and statistics

### Actions:

- **Web server with Express.js:**  
  Implement a web application using Node.js with Express.js. Main functions:
  - Display a list of saved photo series
  - Play generated time-lapse videos
  - Control interface for starting/stopping captures
- **Interface:**  
  Create responsive web UI with photo preview capabilities

## 5. Cloud Integration

### Planned Tasks:

- Implement photo/video uploading to cloud storage
- Create secure authentication and access control
- Support automatic synchronization

### Actions:

- **Cloud Storage:**
  - Explore integration with AWS S3, Google Cloud Storage or similar services
  - Implement upload functionality for photos and timelapses
- **Access Management:**
  - Create secure access tokens for cloud services
  - Implement encryption for sensitive data

## 6. Hardware Integration

### Planned Tasks:

- Design and build enclosure for the system components
- Ensure stable power and reliable connection between components
- Implement power management for long-term deployments

### Actions:

- **Controller:**  
  Optimize code for running on Raspberry Pi or similar single-board computer
- **Case and power:**  
  Design weather-resistant enclosure with:
  - Camera mount with clear lens access
  - Computer housing with ventilation
  - Solar/battery power system
- **Connections:**  
  Plan cable management and component cooling

## 7. Testing and Debugging

### In Progress:

- ✅ Test basic shooting functionality
- ✅ Verify correct timelapse video creation
- Conduct long-term reliability testing
- Assess power consumption and optimization

### Actions:

- **Extended testing:**  
  Run multiple capture series over longer periods to identify stability issues
- **Performance optimization:**  
  Profile the application to identify bottlenecks
- **Error recovery:**  
  Implement automatic recovery from common failures

## 8. Feature Expansion

### Possibilities for further development:

- **Remote control:**  
  Add mobile app or SMS control capabilities
- **Motion detection:**  
  Implement trigger-based capture for events of interest
- **AI integration:**  
  Add image analysis to detect and highlight significant changes
- **Multi-camera support:**  
  Support synchronizing multiple cameras for comprehensive coverage

---

This roadmap reflects the current state of the TimelapseBox project, with completed items marked and upcoming tasks outlined for continued development.
