# Mongoose OS Captive Portal WiFi Web UI

[![Gitter](https://badges.gitter.im/cesanta/mongoose-os.svg)](https://gitter.im/cesanta/mongoose-os?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

- [Mongoose OS Captive Portal WiFi Web UI](#mongoose-os-captive-portal-wifi-web-ui)
  - [Captive Portal Stack](#captive-portal-stack)
  - [Author](#author)
  - [Features](#features)
  - [Installation/Usage](#installationusage)
    - [Full Captive Portal Stack](#full-captive-portal-stack)
    - [Only this library](#only-this-library)
    - [Use specific branch of library](#use-specific-branch-of-library)
  - [Required Libraries](#required-libraries)
  - [How it works](#how-it-works)
  - [Ideal Flow](#ideal-flow)
  - [Directories and Files](#directories-and-files)
  - [Gulp Commands](#gulp-commands)
    - [Minify Files](#minify-files)
    - [GZIP Files](#gzip-files)
    - [Minify and GZIP](#minify-and-gzip)
  - [Changelog](#changelog)
  - [License](#license)

This library is **only** the Captive Portal WiFi Web UI.  It does not include any C or mJS files, and is specifically for use in the Captive Portal WiFi Stack.  This library was built with minimal space in mind, and as such, it **DOES NOT** include any libs like `axios`, `jquery` or anything else that would add unecessary bloat to your already limited space on embedded device!  **Completely vanilla JavaScript!**

![OSX Captive Portal](https://raw.githubusercontent.com/tripflex/captive-portal-wifi-web/master/osx-portal.gif)

## Captive Portal Stack
This is the **WiFi Setup Web UI** library from the [Captive Portal WiFi Full Stack](https://github.com/tripflex/captive-portal-wifi-stack), a full stack (frontend web ui & backend handling) library for implementing a full Captive Portal WiFi with Mongoose OS

## Author
Myles McNamara ( https://smyl.es )

## Features
- Provides web UI for testing and configuring WiFi
- **Completely vanilla JavaScript**, no jQuery, Zepto, or other libraries required (because we all know space is limited)
- **Unminified and non-gzipped** files are only `14.2kb` total in size ( `wifi_portal.css - 2.87 KB`, `wifi_portal.html - 1.45kb`, `wifi_portal.js - 14.2 KB` )
- **Minified** files are only `14.2kb` total in size ( `wifi_portal.css -  1.81 KB`, `wifi_portal.html - 1007 Bytes`, `wifi_portal.js - 6.79 KB` )
- **Minified and gzipped** files are only `3.26kb` total in size ( `wifi_portal.css.gz - 735b`, `wifi_portal.html.gz - 561b`, `wifi_portal.js.gz - 2kb` )
- Displays a dropdown of available networks to connect to
- Included minified files by default on device `fs_min` directory (are copied to device)
- Source files are available in the `fs` directory (are not copied to device)
- Minified and GZIP files are available in the `fs_min_gzip` directory (are not copied to device)

## Installation/Usage

### Full Captive Portal Stack
If you want all of the features this library was built for, you should install the [Captive Portal WiFi Stack](https://github.com/tripflex/captive-portal-wifi-stack) library instead of just this one:

Add this lib your `mos.yml` file under `libs:`

```yaml
  - origin: https://github.com/tripflex/captive-portal-wifi-stack
```

### Only this library
Add this lib your `mos.yml` file under `libs:`

```yaml
  - origin: https://github.com/tripflex/captive-portal-wifi-web
```

### Use specific branch of library
To use a specific branch of this library (as example, `dev`), you need to specify the `version` below the library

```yaml
  - origin: https://github.com/tripflex/captive-portal-wifi-web
   version: dev
```

## Required Libraries
*These libraries are already defined as dependencies of this library, and is just here for reference (you're probably already using these anyways)*
- [captive-portal-wifi-rpc](https://github.com/tripflex/captive-portal-wifi-rpc)

## How it works
On the initial load of captive portal page, a scan will be initiated immediately to scan for available networks from the device `WiFi.PortalScan`, and the dropdown will be updated with the available SSID's the device can connect to.

Once the user enters the password (if there is one), the page will then call the custom RPC endpoint from this library, `WiFi.PortalTest`, which initiates a connection test to the STA using provided credentials.

The captive portal will then wait `2` seconds for first initial check, and then every `5` seconds it will make an RPC call to `Sys.GetInfo` to see if the connection was succesful or not.  After `30` seconds, if the connection is not succesful, a timeout is assumed and notice will be shown on the screen (these values configurable in javascript file).  `30` seconds was chosen as default wifi lib connect timeout is `30` seconds.

If device succesfully connects to the SSID, and `cportal.setup.copy` is not set to `-1` (disabled), the values will be saved to the configured wifi sta `cportal.setup.copy`

All other relevant settings and handling will then also be called (as set/configured in Captive Portal WiFi Setup library)

## Ideal Flow
The ideal flow process for the captive portal setup, is as follows:
- AP is enabled on boot (or by code base)
- User configures wifi settings
- On succesful connection, device saves values, disables AP, and reboots .. automatically connecting to WiFi after reboot

## Directories and Files
- `fs` directory contains source files for the captive portal (unminified and not gzipped) *not copied to device*
- `fs_min_gzip` directory contains the captive portal minified and gzipped files (css/js/index) *not copied to device*
- `fs_min` directory contains the captive portal minified files (css/js/index) *copied to device*

## Gulp Commands
If you decide to modify any of the source files and want to minify them afterwards, it's very easy to do using the included `gulpfile.js`.

First you need to install all the dependencies for doing this, to do so, in the root of this library directory run this command:
```shell
npm install
```

This will install all the required libraries (Gulp, and gulp related modules), and then you can run any of the Gulp commands below.

### Minify Files
When running any of the minify gulp commands below, the files from `fs` directory will be minified and copied to the `fs_min` directory:
**Minify HTML Only**
```shell
gulp minhtml
```
**Minify CSS Only**
```shell
gulp mincss
```
**Minify JS Only**
```shell
gulp minjs
```
**Minify All Files (HTML, CSS, and JS)**
```shell
gulp min
```

### GZIP Files
When running the gzip gulp command, this will gzip all files located in the `fs_min` directory, and output them in the `fs_min_gzip`:
```shell
gulp gzipfiles
```

### Minify and GZIP
You can also run the `deploy` command to minify and gzip all files:
```shell
gulp deploy
```

## Changelog
**1.0.1** (March 10, 2019) 
 - Added support for Enterprise Networks
 - Added Emoji Support to show Lock/Unlock for Network Security Type
 - Hide password field for OPEN networks
 - Increased dropdown, button, and text input sizes to make easier to select on mobile devices
 - Added scroll to top after clicking save (to easily see info banner)

**1.0.0** (March 9, 2019)
 - Initial release

## License
Apache 2.0
