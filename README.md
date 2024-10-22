# QRCode Generator/Tracker for Intiface Sync Over Video

Ever wanted to stream while using Intiface Central and let your viewers feel what you're feeling?

Now you can!

## Overview

![Crimsonland with QRCode Overlay](./img/demo.png)

The premise is fairly simple. The streamer uses an OBS Browser Overlay that generates a QRCode based on commands sent to a simulated device in Intiface Central. This QRCode is then shown somewhere in their video stream. 

Meanwhile, viewers use one of the multiple capture methods provided to scrape the stream and interpret the QRCode, allowing them to follow the haptic action as it happens, in sync with the video stream.

The project is consists of 2 parts:

- An OBS Browser Widget that will connect to the _Websocket Device Manager_ in [Intiface
  Central](https://intiface.com/central). This widget acts as a simulated device for [Intiface
  Central](https://intiface.com/central), and will generate a barcode image which can be used as a
  video overlay.
- Multiple ways for viewers to track QRCodes with in a video and have the commands relayed to [Intiface Central](https://intiface.com/central)
  - A WebRTC based screen capture system
    - This system can be used with no modifications to the browser
  - **\[Coming Soon\]** A userscript for use with Greasemonkey/[Tampermonkey](https://www.tampermonkey.net/)/etc 
  - **\[Coming Soon\]** A browser extension for firefox/chrome

**No downloads are required to start using this system, for either the streamer or viewer.** The Browser Widget and WebRTC based screen capture system are both hosted via this github repo. The only reason this repo needs to be cloned is for development or forking purposes, but we'll be doing out best to provide customization capabilities.

## Example Usage

- Streamer installs the [Intiface Game Haptics Router](http://intiface.com/ghr) (aka GHR), which can
  intercept and reroute rumble commands to [Intiface Central Devices](https://intiface.com/central).
- Streamer uses this OBS Browser Widget, which acts as an Intiface Device and shows the latest speed
  command as a QRCode.
- Streamer plays game on stream w/ GHR, with QRCode widget showing on their stream
- Viewer (with [Intiface Central](https://intiface.com/central) installed) brings up stream on
  Twitch/Fansly/Joystick/etc...
- Viewer uses one of the provided methods to track the QRCode on the stream
- Viewer's QRCode tracker communicates with their copy of Intiface Central, cause hardware to react
  whenever the QRCode updates on the stream. 

## Streamer Instructions

- Install [Intiface Central](https://intiface.com/central)
- In Intiface Central, set up a Websocket Device
  - Under the `App Modes` tab
    - Set `Mode` to `Engine` 
    - Turn `Show Advanced/Experimental Settings` on
    - Turn `Device Websocket Server` (under `Advanced Device Managers`) on
  - Under the `Devices` tab, scroll down to `Websocket Devices (Advanced)`. Add a device of protocol
    type `lovense` with name `LVS-Test`. 
- Start the engine by hitting the large play button on the top bar
- This step should only be done AFTER starting the engine. Open a web browser on the same machine
  that Intiface is running on, and go to https://qdot.github.io/obs-qrcode-video-sync/obsdevice/
  In Intiface Central, a new device should show as connected on the devices tab. Moving the slider
  should update the graph on the webpage. If this doesn't work, check the browser console to see
  if any errors were printed.
- Close the web browser tab with the obs-qrcode-video-sync page in it, make sure Intiface Central
  says no device is connected.
- Add a new browser source to OBS, with https://qdot.github.io/obs-qrcode-video-sync/obsdevice/ as
  the URL
- Place the QRCode on a top layer so it is not occluded

## Viewer Instructions

## License

The QRCode Generator/Tracker project is released as under the BSD 3-Clause License. See [LICENSE](LICENSE) for more info.

The project is distributed with a prebuilt version of node-qrcode v1.5.4, with the following MIT license:

The MIT License (MIT)

Copyright (c) 2012 Ryan Day

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
associated documentation files (the "Software"), to deal in the Software without restriction,
including without limitation the rights to use, copy, modify, merge, publish, distribute,
sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial
portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT
NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES
OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.