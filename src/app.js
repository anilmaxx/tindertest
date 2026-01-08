 const express = require('express');
 const app= express();

 app.use("/", (req, res)=>{
    res.send("hell from yooo!");
 })

 app.listen(3000, ()=>{
   console.log("am listening")
 });