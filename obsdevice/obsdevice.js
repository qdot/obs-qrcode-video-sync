

const generateCode = (speed1, speed2) => {
  console.log("Generating code");
  document.getElementById("canvas").replaceChildren();
  if (speed1 > 99) speed1 = 99;
  if (speed2 > 99) speed2 = 99;
  console.log(`${speed1.toString().padStart(2, "0")}${speed2.toString().padStart(2, "0")}`);
  new QRCode(document.getElementById("canvas"), {
    text: `${speed1.toString().padStart(2, "0")}${speed2.toString().padStart(2, "0")}`,
    width: 128,
    height: 128,
    colorDark : "#000000ff",
    colorLight : `rgba(${speed1 + 150},255,${speed1 + 150},255)`,
    //colorLight : `rgba(255,255,255,255)`,
    correctLevel : QRCode.CorrectLevel.H
  });
};

const runButtplugDevice = () => {
  let deviceWebsocket = new WebSocket("ws://127.0.0.1:54817");
  let deviceAddress = "A9816725B";
  let handshakePacket = {
    identifier: "LVS-Test",
    address: deviceAddress,
    version: 0
  };

  // When we open, send handshake and setup event handlers
  deviceWebsocket.addEventListener("open", (socket) => {
    console.log("Connected");
    deviceWebsocket.send(JSON.stringify(handshakePacket));
    console.log("Handshake Sent");
    deviceWebsocket.addEventListener("message", async (event) => {

      let msg = await event.data.text();
      console.log(msg);
      if (msg.indexOf("DeviceType;") !== -1) {
        console.log("got device type");
        console.log(`Z:10:${deviceAddress};`);
        // Lovense initialization request
        deviceWebsocket.send(`Z:10:${deviceAddress};`);
      } else if (msg.indexOf("Battery;") !== -1) {
        console.log("Got battery");
        // Buttplug will wait for a response to Battery so just make something up.
        deviceWebsocket.send("90;");
      } else {
        console.log(`Lovense command: ${msg}`);
        // If it's a vibrate message, get the vibrate level, which will be 0-20.
        let regex = /Vibrate:([0-9]+)/;
        let match = msg.match(regex);
        if (match.length > 1) {
          currentLovenseValue = Math.floor((match[1] / 20.0) * 100);
          generateCode(currentLovenseValue,currentLovenseValue);
        }
        //document.getElementById("lovense-output").innerHTML = msg;
        // If we wanted to conform with the Lovense protocol we'd send "OK;" here, but Buttplug doesn't care.
      }
    });
  });
}

window.addEventListener("load", () => {
  runButtplugDevice();
  generateCode(0,0);
});