const express = require("express");

const profileRouter = express.Router();
const { adminAuth } = require('../middlewares/auth');
const { validateEditProfile } = require("../utils/validation")

profileRouter.get("/profile/view", adminAuth, async(req, res)=>{
  try{
  const user = req.user;
  res.send(user);

  } catch(err){
    res.status(500).send("error logging user " + err.message);
  }
  
});

profileRouter.patch("/profile/edit", adminAuth, async(req, res)=>{
  try{
    if(!validateEditProfile(req)){
     throw new Error("InVaild edit request");
    }
    const loggedInuser = req.user;
   console.log(loggedInuser);

    Object.keys(req.body).forEach((key) => (loggedInuser[key] = req.body[key]));
  
    await loggedInuser.save(); 
    res.json({ message: `${loggedInuser.firstName} your profile updated successfully`, data: loggedInuser });

    } catch(err){
    res.status(404).send("error " + err.message);
  }
});


module.exports = profileRouter;