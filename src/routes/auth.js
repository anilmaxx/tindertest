const express = require("express");

const authRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
 const {validatesignup} = require("../utils/validation");
 

authRouter.post("/signup", async(req, res)=>{
  try{
  validatesignup(req);
  const { firstName, lastName, email, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({
    firstName, lastName, email, password: passwordHash,
  });
  await user.save();
  res.send("user signed up");
  } catch(err){
    res.status(500).send("error signing up user " + err.message);
  }
  
});

authRouter.post("/login", async(req, res)=>{
  try{
    const {email, password} = req.body;

    const user =await User.findOne({email : email});
    if(!user){
      throw new Error("Invild credentials");
    }
     const isPasswordVaild  = await bcrypt.compare(password, user.password);
    if(isPasswordVaild ){
      const token = await user.getJWT();
      res.cookie("token", token, {expires: new Date(Date.now() + 8 * 3600000)});
      res.send(user)
    } else {
      throw new Error("Invild credentials");
    }
  }
  catch(err){
     res.status(500).send( err.message);
  }
});

authRouter.post("/logout", async(req, res)=>{
  res.cookie("token", null, {expires: new Date(Date.now()),});
  res.send("logged out successful");

})



module.exports = authRouter;