# TimelapseBox

A DIY solution for long-term time lapse photography, inspired by photoSentinel.

## Project Overview

TimelapseBox is a Node.js-based prototype system that captures photos at set intervals and uploads them to create professional time lapse videos. Perfect for:

- Construction site progress documentation
- Nature changes over seasons
- Architecture projects
- Urban development visualization
- Environmental monitoring
- Any long-term visual documentation

## Current Features

- Automated photo capture using connected camera via gphoto2
- Organized file storage in date/time-based folders (data/series_YYYY-MM-DD_HH-MM-SS)
- Separate folders for JPG and RAW files
- Dedicated processing pipeline for photos
- Separate storage for processed images and output videos
- Scheduled photo capture at configurable intervals
- Automatic timelapse video generation after capture sequence
- Camera configuration saving for each session
- Detailed logging with timestamps
- Customizable video quality and framerate settings
- Error handling and recovery
- Support for RAW+JPEG capture for maximum quality

## Planned Features

- Weather-resistant enclosure
- Remote camera control
- Internet connectivity (4G/Wi-Fi)
- Cloud storage integration
- Web gallery for viewing images
- Solar power option
- Battery management
- Status monitoring and alerts
- Automatic deflickering algorithms
- Motion detection triggers
- Advanced color grading with LUTs
- Email/SMS notifications

## Hardware Requirements

- Camera with gphoto2 compatibility (DSLR or mirrorless recommended)
- Single-board computer (Raspberry Pi recommended)
- Weather-resistant enclosure
- Power solution (battery/solar panel)
- Connectivity module (4G modem/WiFi)
- Storage media (high-capacity SD card or external SSD)
- Optional: ND filters for daytime long exposures
- Optional: External power bank for extended operation

## Software Requirements

- Node.js 20.x
- gphoto2
- ffmpeg
- Dependencies for network connectivity
- Cloud storage integration libraries

## Installation

### 1. Install Node.js

Download and install Node.js 20.x from [nodejs.org](https://nodejs.org/).

### 2. Install gphoto2

gphoto2 is required for camera control. Installation depends on your operating system:

**Ubuntu/Debian:**

```bash
sudo apt-get update
sudo apt-get install gphoto2 libgphoto2-dev
```

**macOS (using Homebrew):**

```bash
brew install gphoto2 libgphoto2
```

**Windows:**
Download from [gphoto2 for Windows](http://www.gphoto.org/downloads/).

### 3. Install ffmpeg

ffmpeg is required for timelapse video generation:

**Ubuntu/Debian:**

```bash
sudo apt-get install ffmpeg
```

**macOS (using Homebrew):**

```bash
brew install ffmpeg
```

**Windows:**
Download from [ffmpeg.org](https://ffmpeg.org/download.html).

### 4. Setup the project

```bash
# Clone the repository
git clone https://github.com/helius-lab/timelapsbox.git
cd timelapsbox

# Install dependencies
npm install

# Connect your camera via USB
# Test camera connection
npm run capture
```

## Usage

### Complete Workflow

The complete workflow consists of three steps, which can be run as a sequence:

```bash
# Run the entire workflow: capture → process → create timelapse
npm run workflow
```

Or you can run each step individually:

### Step 1: Capture Photo Series

Capture a series of photos:

```bash
npm run capture:series [totalTimeMinutes] [totalPhotos]
```

This will capture photos at calculated intervals. Default settings are 5 minutes total time with 24 photos.

Before starting the capture, the system automatically saves all current camera settings to a `camera_config.txt` file in the session directory, which is useful for reproducing settings or troubleshooting later.

### Step 2: Process Photos

Process the captured photos (applies adjustments, filters, etc.):

```bash
npm run process [seriesDirectory]
```

If no directory is specified, it uses the most recent series.

### Step 3: Create Timelapse

Generate the timelapse video from processed photos:

```bash
npm run timelapse [seriesDirectory] [fps] [quality]
```

If no directory is specified, it uses the most recent series.

### Viewing Session Logs

You can view the complete log for any session:

```bash
npm run logs [seriesDirectory]
```

If no directory is specified, it displays logs for the most recent session.

### Directory Structure

Photos and timelapses are stored in date-based directories with an organized structure:

```
data/series_YYYY-MM-DD_HH-MM-SS/
  ├── camera_config.txt     - Saved camera settings
  ├── session_log.txt       - Complete session log file
  ├── jpg/                  - Original JPG files
  │   └── photo_*.jpg
  ├── raw/                  - Original RAW (CR2) files
  │   └── photo_*.cr2
  ├── processed/            - Processed images
  │   └── processed_*.jpg
  └── output/               - Final timelapse videos
      └── timelapse.mp4
```

## Configuration

You can adjust the configuration by:

1. Passing command line arguments to the npm scripts:

   ```bash
   npm run capture:series 10 30  # 10 minutes, 30 photos
   npm run timelapse data/series_2023-04-01_12-30-00 30 18  # fps=30, quality=18
   ```

2. Editing the DEFAULT_SETTINGS in the source files:
   - `src/capture/series_capture.js`: Capture settings
   - `src/processing/timelapse_creator.js`: Video generation settings

### Advanced Configuration

For more advanced setups, consider these settings:

- **Long-term deployments**: Increase storage capacity and implement automatic cleanup of old files
- **Day/night transitions**: Set up different capture parameters based on time of day
- **Remote monitoring**: Configure network settings for remote access and monitoring
- **Power management**: Implement sleep cycles to conserve battery during inactive periods

## Camera Settings Recommendations

For optimal timelapse results:

- Use manual mode to prevent exposure flickering
- Set a fixed white balance
- Use manual focus
- For daytime shooting, use aperture around f/8 for maximum sharpness
- For night shooting, use the widest aperture (lowest f-number)
- Consider using ND filters for long exposures in daylight
- Disable image stabilization when camera is mounted on tripod

## Development Roadmap

1. ✅ Improve basic photo capture script with scheduling
2. ✅ Implement time lapse video generation
3. ✅ Organize files in date-based folder structure
4. ✅ Create modular structure for capture, processing, and output
5. ✅ Add support for RAW+JPEG capture and organization
6. ✅ Save camera configuration for each session
7. Add upload functionality to cloud storage
8. Create web interface for viewing and managing photos
9. Design and build weather-resistant enclosure
10. Add power management for long-term deployment
11. Integrate remote control capabilities
12. Implement advanced post-processing options
13. Add support for multiple cameras

For more detailed development plans, see [ROADMAP.md](ROADMAP.md).

## Troubleshooting

### Common Issues

- **Camera not detected**: Ensure your camera is supported by gphoto2 and is in the correct mode (usually PTP or PC connection mode)
- **Permission errors**: On Linux, you may need to add your user to the appropriate group or use sudo
- **Storage issues**: Check available disk space and permissions on the storage directory
- **Camera auto-sleep**: Disable auto-sleep/power saving features on your camera

### Getting Help

If you encounter issues:

1. Check the logs for error messages
2. Verify your camera is on the [supported cameras list](http://www.gphoto.org/proj/libgphoto2/support.php)
3. Open an issue on GitHub with detailed information about your setup and the problem

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Inspiration

This project is inspired by photoSentinel's professional time lapse systems. Visit their website at [photosentinel.com](https://photosentinel.com/) to see examples of professional time lapse solutions.

## Additional Resources

- [gphoto2 supported cameras list](http://www.gphoto.org/proj/libgphoto2/support.php)
- [ffmpeg documentation](https://ffmpeg.org/documentation.html)
- [Timelapse photography guide](https://www.bhphotovideo.com/explora/photography/tips-and-solutions/introduction-time-lapse-photography)
- [Raspberry Pi documentation](https://www.raspberrypi.org/documentation/)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- The gphoto2 team for their excellent camera control library
- FFmpeg developers for their powerful video processing tools
- The Node.js community for creating a versatile runtime environment
