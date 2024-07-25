let express = require("express");
let cors = require("cors");
let http = require("http");
let {Server} = require("socket.io");


let app = express();
app.use(cors());
let server = http.createServer(app);

///socket.io
const io = new Server(server,{
    cors:{
        origin:"*",
        methods:['GET','POST'],
        allowedHeaders:['Content-Type']
    }
});

 let waitingUser = null;

io.on("connection",(socket)=>{
  //  console.log(`new user connected ${socket.id}`);

    if(waitingUser){
      socket.emit("paired",{partnerId:waitingUser.id});
      waitingUser.emit("paired",{partnerId:socket.id});
      waitingUser = null
    }else{
        waitingUser = socket;
    }
    socket.on("disconnect",()=>{
      //  console.log(`user disconnected ${socket.id}`);
        if(waitingUser===socket){
            waitingUser = null;
        }
    })

    socket.on("message",(data)=>{
    //    console.log(data);
        let id = data.partnerId;
        let mess = data.message;
        io.to(id).emit("remess",mess);
    })

});

///basic api's
app.get("/",(req,resp)=>{
    resp.send({result:"hello world"})
})

server.listen(1010,()=>{
    console.log("server started")
});



