const bcrypt=require('bcryptjs')
const {userModel}=require('../models/model')
const mongoose=require('mongoose')
async function validateUserInput(req,res,next) {
    const errors = [];
const{email,password,name,preferences}=req.body;
    // Name validation
    if (typeof name !== 'string' || name.trim().length < 3) {
        errors.push('Name must be at least 3 characters long.');
    }

    // Email validation (basic)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errors.push('Invalid email address.');
    }

    // Password validation
    if (typeof password !== 'string' || password.length < 6) {
        errors.push('Password must be at least 6 characters long.');
    }
  if(errors.length !==0) {
    res.status(400).send({
        errors
    })
}
  try{
      let userExist=await userModel.findOne({email:email});
      if(userExist){
          return res.status(400).send({"user already Exist":userExist.username})
      }
  }
  catch(err){
     return res.status(500).send({"user already Exists": err.message});
  }
  req.user={
      name,
      email,
      password:bcrypt.hashSync(password,10),
      preferences

  }

  next()
}
async function loginValidator(req,res,next){

    let email=req.body.email;
    let password=req.body.password;
    try{
        let user=await userModel.findOne({email:email})
        // console.log(user)
        if(!user){
            return res.status(400).send('user not found')
        }
        if(!(bcrypt.compareSync(password,user.password))){
            return res.status(400).send('password incorrect')
        }
        req.user=user
        // console.log(req.user)
    }
    catch{

    }
next()
}

module.exports={validateUserInput,loginValidator}
