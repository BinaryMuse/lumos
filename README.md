# Lumos

Lumos is a media screen app designed for the Raspberry Pi.

## Installation

After cloning the repository, install its dependencies and start the app.

```bash
npm install
npm start
```

By default, Lumos looks for pictures in `~/.lumos_images`. You should create this directory and fill it with images for it to display before running the app. If you would like Lumos to load images from another folder, pass it to the `LUMOS_IMAGE_DIR` environment variable.

To start Lumos in fullscreen mode, set the `LUMOS_FULLSCREEN` environment variable.
