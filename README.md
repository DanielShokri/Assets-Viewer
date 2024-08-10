# Asset Viewer
[![Asset Viewer](https://img.shields.io/badge/Asset_Viewer-8A2BE2?logo=github)](https://github.com/DanielShokri/Assets-Viewer "Go to GitHub repo") 

[![stars - Trig-JS](https://img.shields.io/github/stars/DanielShokri/Assets-Viewer?style=social)](https://github.com/DanielShokri/Assets-Viewer)

Effortlessly browse and manage your image assets with this simple, local web-based viewer.  Instantly preview images, copy filenames with a click, and enjoy a clean, organized display of your JPGs, PNGs, GIFs, and more.

[![SDmfC.gif](https://s10.gifyu.com/images/SDmfC.gif)](https://gifyu.com/image/SDmfC)

## Features

- **Project-Wide Asset Discovery:** Automatically finds all image assets within your project folder.
- **Local Web Interface:** Quickly view your assets without uploading them anywhere.
- **Image Preview:**  See thumbnails of your images and open them in a modal for a closer look.
- **Copy Filenames:** Easily copy asset filenames to your clipboard for use in your projects.
- **Supported Formats:** View JPG, JPEG, PNG, GIF, WEBP, and SVG images.

## Installation

NPM:
```bash
npm i asset-viewer-cli
```

YARN:
```bash
yarn add asset-viewer-cli
```


## Usage
After installation, you can use the asset-viewer command in any project directory:

```bash
asset-viewer view
```
This will open the asset viewer in your default web browser, usually at http://localhost:3111.

## Options

--dir, -d: Specify a custom directory to scan for assets.

Example:
```bash
asset-viewer view --dir=images
```

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.  
[Repo](https://github.com/DanielShokri/Assets-Viewer)
## License
This project is licensed under the MIT License - see the LICENSE file for details.
