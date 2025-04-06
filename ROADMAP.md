# Roadmap for Local Time-lapse Photography System Prototype

## 1. Photography Automation

### Tasks:

- Automatically initiate shooting at specified intervals.
- Log processes and errors.

### Actions:

- **Node.js script for photography:**  
  Use the prepared script (with `gphoto2 --capture-image-and-download` command) and adapt it to work in a loop. For example, implement shooting every N minutes using an infinite loop or set up a scheduled task.
- **Scheduler:**
  - If using system scheduler – configure cron to run the script with the desired frequency.
  - If the script manages the cycle – use `setTimeout()` or `setInterval()` functions.

## 2. Photo Storage Organization

### Tasks:

- Save photos in a structured format (e.g., by date).
- Ensure access to files for further processing.

### Actions:

- **Folder structure:**  
  Organize directories, for example:

  ```
  /photos/YYYY-MM-DD/
  ```

  where each new photo is saved with a unique name (based on timestamp).

- **Logging:**  
  Add entries to a log file when photos are successfully saved or when errors occur.

## 3. Time-lapse Video Generation

### Tasks:

- Create time-lapse videos from photo sequences.
- Configure parameters (FPS, codec, resolution).

### Actions:

- **Using ffmpeg:**  
  Example command:
  ```bash
  ffmpeg -framerate 24 -pattern_type glob -i '/photos/2025-03-30/*.jpg' -c:v libx264 -pix_fmt yuv420p timelapse.mp4
  ```
- **Automation:**  
  Create a separate Node.js script that will run ffmpeg after the shooting session is complete or on a schedule (for example, at the end of the day).

## 4. Local Web Server and Interface

### Tasks:

- Create a simple interface for viewing the photo gallery and generated time-lapse.
- Provide control capabilities (start shooting, view status, watch videos).

### Actions:

- **Web server with Express.js:**  
  Implement a web application using Node.js with Express.js. Main functions:
  - Display a list of saved photos (gallery).
  - Play generated time-lapse videos.
  - Button for manually starting the shooting.
- **Interface:**  
  Start with simple HTML pages, then add CSS to improve the appearance.

## 5. Hardware Integration

### Tasks:

- Ensure stable power and reliable connection between components.
- Assemble everything in a compact and convenient case.

### Actions:

- **Controller:**  
  Consider using Raspberry Pi, which will:
  - Run Node.js scripts for shooting and processing.
  - Manage the web server.
- **Case and power:**  
  Plan the assembly of a case that will house:
  - Camera (with convenient access to the lens).
  - Raspberry Pi (or other computer).
  - Power source (e.g., power bank or adapter).
- **Connections and cables:**  
  Ensure all connections are reliable and provide ways to cool components (if necessary).

## 6. Testing and Debugging

### Tasks:

- Test each stage of the system.
- Ensure correct creation of time-lapse videos and web interface functionality.

### Actions:

- **Test shooting:**  
  Conduct several test cycles of automatic shooting and verify that photos are saved in the correct directory.
- **Video generation check:**  
  Run the ffmpeg script on a test folder with photos, check parameters (FPS, quality).
- **Web server debugging:**  
  Launch the Express.js application, check the gallery display and video playback, configure logs to track errors.

## 7. Feature Expansion

### Possibilities for further development:

- **Notifications:**  
  Add a notification system (e.g., email or messenger) to inform about completed shoots or errors.
- **Control interface:**  
  Implement a panel to change shooting settings (interval, camera modes) in real time.
- **Cloud integration:**  
  Expand functionality by adding the ability to send photos to a cloud server for backup or further processing.

---

This plan will allow you to create a local prototype of a time-lapse photography system using a Sony A7S camera, gPhoto2, and related components. As you implement the basic functions, you can add new features and optimize the system.
