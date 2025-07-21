
const express=require("express");
const cors=require("cors");
const cookieParser=require("cookie-parser");
const {Server}=require("socket.io");
const http=require("http");
const app=express();




require("./connection");
require("dotenv").config();

const PORT=process.env.PORT || 3000;
const server=http.createServer(app);
const io=new Server(server,{
    cors:{
      origin:"http://localhost:5173",
      methods: ["GET","POST"]
    }

  });


app.use(cors({
  credentials: true,
  origin: "http://localhost:5173"
}))

app.use(express.json());
app.use(cookieParser());


io.on("connection",(socket)=>{
  console.log("user connected");
  
  socket.on("joinConversation",(conversationId)=>{
    console.log(`User joined conversationId of ${conversationId}`);
    socket.join(conversationId);
  })
  
  socket.on("sendMessage",(convId,messageDetail)=>{
    console.log("message sent");
    
    io.to(convId).emit("receiveMessage",messageDetail)
    
  })
  
})

const userRoute=require("./routes/user");
const postRoute=require("./routes/post");
const NotificationRoute=require("./routes/notification");
const CommentRoute=require("./routes/comment");
const ConversationRoute=require("./routes/conversation");
const MessageRoute=require("./routes/message");


app.use("/api/auth",userRoute);
app.use("/api/post",postRoute);
app.use("/api/notification",NotificationRoute);
app.use("/api/comment",CommentRoute);
app.use("/api/conversation",ConversationRoute);
app.use("/api/message",MessageRoute);


server.listen(PORT,(req,res)=>{
    console.log("backend running on port no",PORT);
})

