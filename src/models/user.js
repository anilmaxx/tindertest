const mongoose = require('mongoose');
const validator = require("validator");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
    firstName:{
        type:String,
        required : true
    },
    lastName:{
        type:String
    },
    email:{
        type:String,
        required : true,
        lowercase : true,
        unique : true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("invalid email format");
            }
        }
    },
    password:{
        type:String,
        required : true,
        minLength: 8,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("enter strong password"+value);
            }
        }
    },
    age:{
        type:Number,
        min: 18,
    },
    gender:{
        type:String,
        enum:{
            values: ["male", "female", "others"],
            message: `{VALUE} data not valid`
        }
    },
    photoUrl:{
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/219/219970.png",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("invalid email format");
            }
        }
    },
    about:{
        type: String,
    },
    skills:{
        type: [String],
    }
}, {
    timestamps: true,
});
  userSchema.methods.getJWT = async function(){
     const user = this;
     const token = await jwt.sign({_id:user._id}, "REB@LST@R", {expiresIn: "8h"});
     return token
  }

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;