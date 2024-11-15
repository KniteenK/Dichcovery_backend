import bcrypt from "bcrypt";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other']
    },
    age: {
        type: Number,
        default: null
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    allergies: [{
        type: String,
    }],
    region: {
        continent: {
            type: String,
            required: true
        },
        subRegion: {
            type: String,
            required: true
        }
    }
});

userSchema.methods.generateAccessToken = async function () {
    return jwt.sign(
      {
        _id: this._id , 
        username: this.username , 
        email: this.email
      }
      , process.env.ACCESS_TOKEN_SECRET , 
      { 
        expiresIn:  process.env.ACCESS_TOKEN_EXPIRY ,
      }  
    )
  }
  userSchema.methods.generateRefreshToken = async function () {
    return jwt.sign(
      {
        _id: this._id ,
      }
      , process.env.ACCESS_REFRESH_TOKEN , 
      { 
        expiresIn:  process.env.REFRESH_TOKEN_EXPIRY ,
      }  
    )
  }

userSchema.pre("save" , async function (next) {
    if (!this.isModified("password")) return next() ;
    
    this.password = await bcrypt.hash(this.password , 10) ;
    next() ;
})
  
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password) ;
}


export const user = mongoose.model('User', userSchema) ;