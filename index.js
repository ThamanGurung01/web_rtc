const videoElem = document.getElementById("video");
const startElem = document.getElementById("start");
const stopElem = document.getElementById("stop");
const displayMediaOptions = {
  video: {
    displaySurface: "browser",
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
async function startCapture(displayMediaOptions) {
  let captureStream = null;

  try {
    captureStream =
      await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
  } catch (err) {
    console.error(`Error: ${err}`);
  }
  return captureStream;
}
startElem.addEventListener("click", async () => {
console.log("start capture....");
const captureStream = await startCapture(displayMediaOptions);
console.log("captureStream", captureStream);
videoElem.srcObject = captureStream;
videoElem.play();
});
stopElem.addEventListener("click", () => {
let tracks=videoElem.srcObject.getTracks();
tracks.forEach((track) => track.stop());
videoElem.srcObject = null;
});