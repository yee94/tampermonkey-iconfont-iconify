# Tampermonkey Script for iconfont -> iconify JSON and React component

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c460180364f3425f8776489c61fb448f~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

This Tampermonkey script is designed to add two new download options to the [iconfont.cn](https://www.iconfont.cn/) website.

## Installation

1. Install the Tampermonkey extension for your browser.
2. Click on the following link and click the "install" button: **[link to script](https://github.com/yee94/tampermonkey-iconfont-iconify/raw/main/index.user.js)**
3. Go to [iconfont.cn](https://www.iconfont.cn/) and open the project you want to download.

## Usage

1. Once the script is installed and you are on the project page, a new option "Iconify JSON" will appear in the "download" menu. Clicking this option will download the icons in the project as a JSON file that is compatible with the Iconify library.
2. Another option "React component" will also appear in the "download" menu. Clicking this option will download the icons in the project as individual React components.

## Features

- Cleans up the SVG files by removing bad attributes, tags, and styles.
- Modifies the SVG files to add React-specific attributes and styles.
- Provides two download options: Iconify JSON and React component.

## Note

This script is designed for use with the iconfont.cn website, and may not work on other websites.

## Contribution

If you have any suggestions for improvements or find any bugs, please feel free to open an issue or pull request on Github repository.
