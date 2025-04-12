const jwt=require("jsonwebtoken");

async function userAuth(req,res,next){
    let token=req.headers.authorization.split(' ')[1];
    try{
        let decoded=jwt.verify(token,process.env.JWT_SECRET);
        next()
    }
    catch(err){
        return res.status(400).json({
            name:err.name,
            message:err.message,
        })
    }

}
module.exports={userAuth};