const router=require('express').Router()
const {userModel,userFinanceModel}=require('../models/model');
// const jsonwebtoken=require('jsonwebtoken');
const {userAuth}=require('../authentication/authenticator');
const {validateUserInput, loginValidator}=require("../authentication/validator");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const multer = require("multer");
const { updateProfilePicture } = require('../controller/controller');
const upload = require('../middleware/upload');
//to signup
router.post('/register', validateUserInput,async (req,res)=>{

    try{
    let user=await userModel.create(req.user)
    const token=jwt.sign({
        name:user.name,
        email:user.email,
        preferences:user.preferences

    },process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).send({
        UserId:user._id,
        name:user.name,
        email:user.email,
        preferences:user.preferences,
        token:token
    });
}
catch(err){
    res.status(500).send({error:"server error while creating user"})
}


})
//login
router.post('/login',loginValidator,async (req,res)=>{
let user=req.user
    console.log(user)
    try{
        const token=jwt.sign({

        },process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).send({
            Id:user._id,
            name:user.name,
            email:user.email,
            preferences:user.preferences,
            token:token,
        });
    }
    catch(err){
        res.status(500).send({error:err.message})
    }
})
// To create user Financial Profile
router.post('/createFinancialProfile',userAuth,async(req,res)=>{



        try {
            req.body.userId = new mongoose.Types.ObjectId(req.body.userId);
            const user = new userFinanceModel(req.body);
            const savedUser = await user.save()

            res.status(201).json({
                message: "User financial profile  created successfully"

                });


        } catch (err) {
            // Validation Error
            if (err.name === 'ValidationError') {
                const errors = Object.values(err.errors).map(e => e.message);
                return res.status(400).json({
                    message: "Validation failed",
                    errors
                });
            }

            // Duplicate Key Error (e.g., unique email)
            if (err.code === 11000) {
                return res.status(400).json({
                    message: "Duplicate field value entered",
                    key: err.keyValue
                });
            }

            //  Other Unexpected Errors
            console.error("Error saving user:", err);
          return  res.status(500).json({
                message: "Server error while saving user"
            });
        }




})

//to get the financial status of users
router.get("/userFinancialStatus/:id",userAuth,async(req,res)=>{
    try{
        let userId=new mongoose.Types.ObjectId(req.params.id);
        let user=await userFinanceModel.find({userId:userId})
        res.status(200).json(user)
    }
    catch(err){
        res.status(500).send({error:err.message})
    }
})
// to update profile Picture
router.put('/update-profile-pic/:id',userAuth, upload.single('image'), updateProfilePicture);








module.exports=router