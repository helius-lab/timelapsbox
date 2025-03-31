# TimelapseBox

A DIY solution for long-term time lapse photography, inspired by photoSentinel.

## Project Overview

TimelapseBox is a prototype system that captures photos at set intervals and uploads them to create professional time lapse videos. Perfect for:

- Construction site progress documentation
- Nature changes over seasons
- Architecture projects
- Any long-term visual documentation

## Current Features

- Basic photo capture using connected camera via gphoto2
- Timestamp-based file naming

## Planned Features

- Weather-resistant enclosure
- Remote camera control
- Scheduled photo capture
- Internet connectivity (4G/Wi-Fi)
- Cloud storage integration
- Web gallery for viewing images
- Automatic time lapse video generation
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

- Python 3
- gphoto2
- Dependencies for network connectivity
- Cloud storage integration libraries

## Installation (Current Prototype)

1. Ensure gphoto2 is installed on your system
2. Connect your camera via USB
3. Clone this repository
4. Run `python capture_photo.py` to test camera connection

## Development Roadmap

1. Improve basic photo capture script with scheduling
2. Add upload functionality to cloud storage
3. Create web interface for viewing and managing photos
4. Implement time lapse video generation
5. Design and build weather-resistant enclosure
6. Add power management for long-term deployment
7. Integrate remote control capabilities

## Usage

Currently, the system only supports manual photo capture:

```
python capture_photo.py
```

This will capture a photo with the connected camera and save it with a timestamp filename.

## Inspiration

This project is inspired by photoSentinel's professional time lapse systems. Visit their website at [photosentinel.com](https://photosentinel.com/) to see examples of professional time lapse solutions.

## Additional info

- [gphoto2 support cameras](http://www.gphoto.org/proj/libgphoto2/support.php)
