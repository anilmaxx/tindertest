const express = require("express");
const User = require("../models/user");
const requestRouter = express.Router();
const { adminAuth } = require('../middlewares/auth');
const ConnectionRequest = require("../models/connectionrequest")

requestRouter.post("/request/send/:status/:toUserId", adminAuth, async(req, res)=>{
  try{
   const fromUserId = req.user._id;
   const toUserId = req.params.toUserId;
   const status = req.params.status;

   const allowedStatus= ["ignored", "interested"];
   if(!allowedStatus.includes(status)){
     return res.status(404).json({message:"invaild status type "+status})
   }



   const toUser = await User.findById(toUserId);
   if(!toUser){
    return res.status(404).json({message:"User not found"})
   }
   
   const existConnection = await connectionRequest.findOne({
    $or:[
      {fromUserId, toUserId},
      {fromUserId: toUserId, toUserId: fromUserId}
    ],
    
   });
   if(existConnection){
     return res.status(404).json({message:"connection req already existed"})
   
   }

   const connectionRequest = new ConnectionRequest({
    fromUserId, toUserId, status
   });

   const data = await connectionRequest.save();

   res.json({
    message: "connection "+status+" sent successfully to "+ toUser.firstName,
    data
   })

  } catch(err){
    res.status(404).send("error " + err.message);
  }
})

requestRouter.post("/request/review/:status/:requestId", adminAuth, async(req, res)=>{
 try{
    const loggedInUser = req.user;
    const { status, requestId} = req.params;
    const allowedStatus = ["accepted", "rejected"];
    if(!allowedStatus.includes(status)){
       return res.status(404).json({message:"invaild status type "+status})
    }

    const connectionRequest = await ConnectionRequest.findById({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested",
    })

    if(!connectionRequest){
      return res.status(404).json({message:"connection request not found"});
    }

    connectionRequest.status = status;

   const data = await connectionRequest.save();

    res.json({ message: "connection request " + status + " successfully", data });
    
  } catch(err){
   res.status(404).send("error " + err.message);
 }
})

module.exports = requestRouter;