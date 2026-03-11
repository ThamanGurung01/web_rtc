const answerElem=document.getElementById('answer');
const videoElem=document.getElementById('video');
const initReceiver=async()=>{
    console.log("init receiver....");
    const pc=new RTCPeerConnection({
        iceServers:[
            {
              urls:"stun:stun.l.google.com:19302"
            }
        ]});
const ua = navigator.userAgent;
const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(ua);
const isDesktop = /Windows|Macintosh|Linux/i.test(ua) && !isMobile;
const socketUrl=isMobile?"ws://192.168.254.142:3000":isDesktop?"ws://localhost:3000":"ws://localhost:3000";
    const socket=new WebSocket(socketUrl);
        pc.onicecandidate=(event)=>{
        if(event.candidate&&socket.readyState === WebSocket.OPEN){
        socket.send(JSON.stringify({type:"candidate",candidate: event.candidate}));
        }
        }
    socket.onmessage=async(message)=>{
        const data=JSON.parse(message.data);
    if(data.type==="offer"){
        await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
        const answer=await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.send(JSON.stringify({type:"answer",sdp:answer}));
    }
    if(data.type==="candidate"){
    await pc.addIceCandidate(data.candidate);
    }
    }
    pc.ontrack=(event)=>{
        videoElem.srcObject=event.streams[0];
    }
}
answerElem.addEventListener('click',async()=>{
    await initReceiver();
});