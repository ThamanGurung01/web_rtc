import WebSocket,{WebSocketServer} from "ws";
const wss=new WebSocketServer({ port: 3000 });
let clients=[];
wss.on("connection",(ws)=>{
    clients.push(ws);
    ws.on("message",(message)=>{
        console.log("Received message:", message.toString());
        clients.forEach(client=>{
            if(client!==ws&&client.readyState===WebSocket.OPEN){
                client.send(message.toString());
            }
        })
    })
    ws.on("close",()=>{
        clients=clients.filter(client=>client!==ws);
    })
})
console.log("WebSocket signaling server is running on ws://localhost:3000");