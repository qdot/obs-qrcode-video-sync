let videoElem;
let canvas;
let context;
let ctxMtx;
let lastpt;
let videoWidth = 0;
let videoHeight = 0;
let pointBoundary = [[0, 0], [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]];
let codeFound = false;
let client = new buttplug.ButtplugClient("QRCode Tracker Client");
let lastSpeedVal = -1;

window.addEventListener("load", async () => {
  videoElem = document.getElementById("video");
  console.log(videoElem);
  canvas = document.querySelector("canvas");
  context = canvas.getContext("2d");
  
  try {
    const connector = new buttplug.ButtplugBrowserWebsocketClientConnector("ws://127.0.0.1:12345/buttplug");
    await client.connect(connector);
    client.addListener('deviceadded', async (device) => {
      let ul = document.getElementById("devices");
      let li = document.createElement("li");
      li.appendChild(document.createTextNode(device.name));
      if (device.vibrateAttributes.length > 0) {
        let button = document.createElement("button");
        button.innerHTML = "Click to vibrate";
        button.addEventListener('click', async () => {
          await device.vibrate(1.0);
          setTimeout(async () => {
            await device.stop();
          }, 3000);
        });
        ul.appendChild(li);
        li.appendChild(button);
      }
      await client.stopScanning();
    });
    client.addListener('scanningfinished', async (device) => {
      console.log("Scanning Finished");
    });
    await client.startScanning();
  } catch (e) {
    console.log(e);
    return;
  }
    
});

const displayMediaOptions = {
  video: {
    displaySurface: "window",
  },
  audio: {
    suppressLocalAudioPlayback: false,
  },
  preferCurrentTab: false,
  selfBrowserSurface: "exclude",
  systemAudio: "include",
  surfaceSwitching: "include",
  monitorTypeSurfaces: "include",
};

const startCapture = (displayMediaOptions) => {
  return navigator.mediaDevices
    .getDisplayMedia(displayMediaOptions)
    .then((surface) => {
      console.log(videoElem);
      videoElem.addEventListener("loadedmetadata", () => {
        videoWidth = videoElem.videoWidth;
        videoHeight = videoElem.videoHeight;
        canvas.width = videoWidth;
        canvas.height = videoHeight;
        pointBoundary = [[0, 0], [videoWidth, videoHeight]];
        console.log(`${videoWidth} ${videoHeight}`);
        updateImageData();
        findQRCode();
      });
      videoElem.srcObject = surface;
    })
    .catch((err) => {
      console.error(err);
      return null;
    });
}

const updateImageData = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(video, pointBoundary[0][0] - 10, pointBoundary[0][1] - 10, pointBoundary[1][0] - pointBoundary[0][0] + 20, pointBoundary[1][1] - pointBoundary[0][1] + 20, 0, 0, pointBoundary[1][0] - pointBoundary[0][0] + 20, pointBoundary[1][1] - pointBoundary[0][1] + 20);
  setTimeout(updateImageData, 50);
}

const findQRCode = async () => {
  let imageData = context.getImageData(0, 0, (pointBoundary[1][0] - pointBoundary[0][0]), (pointBoundary[1][1] - pointBoundary[0][1]));
  symbols = await zbarWasm.scanImageData(imageData);
  if (symbols.length == 0) {
    console.log("Reset");
    // Reset size and find new code elsewhere.
    pointBoundary = [[0, 0], [videoWidth, videoHeight]];
    codeFound = false;
  } else {
    if (!codeFound) {
      let minX, minY, maxX, maxY;
      symbols[0].points.forEach((v) => {
        if (minX === undefined || v.x < minX) {
          minX = v.x
        }
        if (maxX === undefined || v.x > maxX) {
          maxX = v.x;
        }
        if (minY === undefined || v.y < minY) {
          minY = v.y;
        }
        if (maxY === undefined || v.y > maxY) {
          maxY = v.y;
        }
      });
      pointBoundary = [[minX, minY], [maxX, maxY]];
      codeFound = true;

    }
    let result = symbols[0].decode();
    let speedVal = parseInt(result.substring(2));
    if (lastSpeedVal != speedVal) {
      for (var device of client.devices) {
        device.vibrate(speedVal / 99);
      }
      lastSpeedVal = speedVal;
    }
    //symbols.forEach(s => s.rawData = s.decode());
  }
  setTimeout(findQRCode, 100);
}
