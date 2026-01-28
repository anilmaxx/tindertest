 
 const jwt = require("jsonwebtoken");
 const User = require("../models/user");
 const adminAuth = async(req, res, next) =>{
    
    try{
      const {token} = req.cookies;
      if(!token){
        return res.status(401).send("access denied, login required");
      }
      const decodedMsg = await jwt.verify(token, "REB@LST@R");
      const { _id } = decodedMsg; 
      
        const user = await User.findById(_id);
        if(!user){
          throw new Error("user does not exist");
        }
        req.user = user;
        next();
      
        } catch(err){
          res.status(400).send("error logging user " + err.message);
        };
};

module.exports={
    adminAuth,
};