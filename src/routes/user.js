const express = require('express');
const { adminAuth } = require('../middlewares/auth');
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionrequest")
const User = require("../models/user");

USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills" ;

userRouter.get("/user/request/received", adminAuth, async (req, res)=>{
    try{
        const loogedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loogedInUser._id,
            status: "interested"
        }).populate("fromUserId", USER_SAFE_DATA);
        res.json({message: "data fetched successfully", data : connectionRequests});
    }catch(err){
        return res.status(500).json({message: "Internal server error"});
    }
})

userRouter.get("/user/connections", adminAuth, async (req, res)=>{
    try{
    const loogedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
    $or: [
        {toUserId: loogedInUser._id, status: "accepted"},
        {fromUserId: loogedInUser._id, status: "accepted"}
    ]
    }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);
    const data = connectionRequests.map((row)=>{
        if(row.fromUserId._id.toString() === loogedInUser._id.toString()){
            return row.toUserId;
        }
        return row.fromUserId
        });
    res.json({message: "data fetched successfully", data });
    }
    catch(err){
        return res.status(500).json({message: "connection fectching failed"});
    }
});

userRouter.get("/user/feed", adminAuth, async (req, res)=>{
    try{
        const loogedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const connectionRequests = await ConnectionRequest.find({
        $or: [
            {toUserId: loogedInUser._id},
            {fromUserId: loogedInUser._id}
        ]
    }).select("fromUserId toUserId");


    const hiddenUserIds = new Set();
    connectionRequests.forEach(req=>{
        hiddenUserIds.add(req.fromUserId.toString());
        hiddenUserIds.add(req.toUserId.toString());
    });

    const users = await User.find({
        $and:[
            {_id: {$nin: Array.from(hiddenUserIds)}},
            {_id:{ $ne: loogedInUser._id }}
        ]
    }).select(USER_SAFE_DATA).skip((page - 1) * limit).limit(limit);

    res.json({ data : users});
    }
    catch(err){
        return res.status(500).json({message: "feed fectching failed"});
    }
})

module.exports = userRouter;