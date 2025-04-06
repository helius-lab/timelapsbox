# TimelapseBox

A DIY solution for long-term time lapse photography, inspired by photoSentinel.

## Project Overview

TimelapseBox is a Node.js-based prototype system that captures photos at set intervals and uploads them to create professional time lapse videos. Perfect for:

- Construction site progress documentation
- Nature changes over seasons
- Architecture projects
- Any long-term visual documentation

## Current Features

- Basic photo capture using connected camera via gphoto2
- Timestamp-based file naming
- Scheduled photo capture at regular intervals
- Timelapse video generation from captured photos

## Planned Features

- Weather-resistant enclosure
- Remote camera control
- Internet connectivity (4G/Wi-Fi)
- Cloud storage integration
- Web gallery for viewing images
- Solar power option
- Battery management
- Status monitoring and alerts

## Hardware Requirements

- Camera with gphoto2 compatibility
- Single-board computer (Raspberry Pi recommended)
- Weather-resistant enclosure
- Power solution (battery/solar panel)
- Connectivity module (4G modem/WiFi)
- Storage media

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

### Basic photo capture

Capture a single photo:

```bash
npm run capture
```

### Scheduled photo series

Capture a series of photos over time:

```bash
npm run capture:series
```

This will take 30 photos over 60 minutes by default. You can configure the number of photos and total time by editing the constants in `capture_series.js`.

### Generate timelapse video

Create a timelapse video from captured photos:

```bash
npm run generate-video
```

The script will automatically find all photos matching the pattern `photo_*.jpg` in the current directory and generate a timelapse video.

## Configuration

You can adjust the configuration in the JavaScript scripts:

- `capture_series.js`: Modify `TOTAL_TIME_MINUTES` and `TOTAL_PHOTOS` to change capture schedule
- `generate_timelapse.js`: Adjust `FRAME_RATE`, `PHOTO_DIR`, and `PHOTO_PATTERN` to customize video generation

## Development Roadmap

1. Improve basic photo capture script with scheduling ✅
2. Implement time lapse video generation ✅
3. Add upload functionality to cloud storage
4. Create web interface for viewing and managing photos
5. Design and build weather-resistant enclosure
6. Add power management for long-term deployment
7. Integrate remote control capabilities

## Inspiration

This project is inspired by photoSentinel's professional time lapse systems. Visit their website at [photosentinel.com](https://photosentinel.com/) to see examples of professional time lapse solutions.

## Additional info

- [gphoto2 supported cameras list](http://www.gphoto.org/proj/libgphoto2/support.php)
- [ffmpeg documentation](https://ffmpeg.org/documentation.html)
