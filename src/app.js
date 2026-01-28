 const express = require('express');
 const app= express();
 const connectdb = require("./config/database");
 const cookieParser = require("cookie-parser");
 const cors = require("cors")
 app.use(cors({
  origin:"http://localhost:5173",
  credentials:true,
 }))
 app.use(cookieParser());
 app.use(express.json());
 const authRouter = require("./routes/auth");
 const profileRouter = require("./routes/profile");
 const requestRouter = require("./routes/request");
 const userRouter = require("./routes/user")


app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);


 connectdb().then(()=>{
   console.log("database connected");
   app.listen(3000, ()=>{
   console.log("am listening")
 });
 }).catch((err)=>{
   console.log("error connecting database", err);
});

 