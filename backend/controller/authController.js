import jwt from "jsonwebtoken";
import User from "../models/user.js";
import user from "../models/user.js";

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const {username,email,password}=req.body;

    const userExists= await User.findOne({$or:[{email}]});

    if(userExists){
        return res.status(400)
        .json({
            success:false,
            error:userExists.email===email ? "email already registered" : "userName already taken",
            statusCode: 400,

        })
    }

    //create user

    const user=await User.create({
        username,
        email,
        password,
    })

    //generate token

    const token =generateToken(user._id);
    res.status(201).json({
        success:true,
        data:{
            user:{
                id:user._id,
                username:user.username,
                email:user.email,
                profileImage:user.profileImage,
                createdAt:user.createdAt
            },
            token,
        },
        message:"user registered successfully",
    })

    
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login=async(req,res,next)=>{

   try {
     const {email,password}=req.body;
    //validate input

    if(!email || !password){
        res.status(401).json({
            success:false,
            error:"please enter email and password0",
            statusCode:400,

        })
    }
    const user=await User.findOne({email }).select("+password")
    //get user profile

    if(!user){
        return res.status(401).json({
            success:false,
            error:"invalid credentials",
            statusCode:401,
        })
    }

    const isMatch=await user.matchPassword(password)

    if(!isMatch){
        return res.status(401).json({
            success:false,
            error:"password does`t match",
            statusCode:401,
        })
    }

    //generate token

    const token= generateToken(user._id);
    res.status(200).json({
        success:true,
        user:{
            id:user._id,
            username:user.username,
            email:user.email,
            profileImage:user.profileImage,

        },
        token,
        message:"user login successfully"
    });
    //get api

    
   } catch (error) {
    next(error);
    
   }

};

export const getProfile=async(req,res,next)=>{
    try {
        const user= await User.findById(req.user._id);
         res.status(200).json({
            success:true,
            message:"profile get successfully",
            data:{
                id:user._id,
                username:user.username,
                email:user.email,
                profileImage:user.profileImage,
                createdAt:user.createdAt,
                updatedAt:user.updatedAt,

            },
        });
    } catch (error) {
        next(error);
        
    }

};

export const updateProfile=async(req,res,next)=>{

   try {
     const{username,email,profileImage}=req.body;

     const user=req.user;

    if(username) user.username=username;
    if(email) user.email=email;
    if(profileImage) user.profileImage=profileImage;

    await user.save();

    res.status(200).json({
        success:true,
        data:{
            id:user._id,
            username:user.username,

            email:user.email,
            profileImage:user.profileImage,

        },
        message:"profile updated successfully"
    })

    
   } catch (error) {
    next(error);
    
   }




};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: "Please provide current and new password",
      });
    }

    const user = await User.findById(req.user._id).select("+password");

    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Current password is incorrect",
      });
    }

    user.password = newPassword; // ✅ correct
    await user.save();           // triggers hashing

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};

