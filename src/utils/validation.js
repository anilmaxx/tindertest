const validator = require("validator");
const validatesignup = (req)=>{
    const { firstName, lastName, email, password } = req.body;

    if(!firstName || !lastName){
        throw new Error("name not vaild");
        
    } 
    else if(firstName.length<4 || lastName.length>50){
       throw new Error("name not vaild");
    }
    else if(!validator.isEmail(email)){
       throw new Error("email not vaild");
    }
    else if(!validator.isStrongPassword(password)){
       throw new Error("password not storng password");
    }
};

const validateEditProfile = (req) =>{
   const allowEdit = ["firstName", "lastName", "email", "age", "gender", "photoUrl", "about", "skills"];
   const isAllowed = Object.keys(req.body).every((field) => allowEdit.includes(field));
   return isAllowed
   
}

module.exports = { validatesignup, validateEditProfile};