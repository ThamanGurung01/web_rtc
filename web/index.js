const videoElem = document.getElementById("video");
const offerElem=document.getElementById("offer");
// const startElem = document.getElementById("start");
// const stopElem = document.getElementById("stop");
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

async function createOffer(displayMediaOptions){
  console.log("create offer....");
const captureStream=await startCapture(displayMediaOptions);
videoElem.srcObject = captureStream;
videoElem.play();
const pc=new RTCPeerConnection({
  iceServers:[
    {
      urls:"stun:stun.l.google.com:19302"
    }
  ]
});
const socket=new WebSocket("ws://localhost:3000");
pc.onicecandidate=(event)=>{
  if(event.candidate && socket.readyState === WebSocket.OPEN){
  socket.send(JSON.stringify({type:"candidate",candidate: event.candidate}));
  }
}
captureStream.getTracks().forEach(track=>{
  pc.addTrack(track,captureStream);
})
socket.onopen=async()=>{
const offer= await pc.createOffer();
await pc.setLocalDescription(offer);
socket.send(JSON.stringify({type:"offer",sdp:offer}));
}
socket.onmessage=async(message)=>{
  const data=JSON.parse(message.data);
if(data.type==="answer"){
  await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
}
  if(data.type==="candidate"){
    await pc.addIceCandidate(data.candidate);
  }
};
}
offerElem.addEventListener("click",async()=>{
 await createOffer(displayMediaOptions);
});

// startElem.addEventListener("click", async () => {
// console.log("start capture....");
// const captureStream = await startCapture(displayMediaOptions);
// console.log("captureStream", captureStream);
// videoElem.srcObject = captureStream;
// videoElem.play();
// });
// stopElem.addEventListener("click", () => {
// let tracks=videoElem.srcObject.getTracks();
// tracks.forEach((track) => track.stop());
// videoElem.srcObject = null;
// });