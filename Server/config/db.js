const mongoose=require('mongoose')
require('dotenv').config();

function connectDB(url){
    try {
        mongoose.connect(url)
            .then(() => {
                console.log("MongoDB Connected");
            })
    }
    catch(err){
        console.log("MongoDB Connection Error");
    }

}
module.exports = connectDB;
