const mongoose= require("mongoose");

const connectDB=async()=>{
    try{
        await mongoose.connect('mongodb://127.0.0.1:27017/morning_backend_mvc')
        console.log("mongodb connected successfully");
    }
    catch(err){
        console.log('Database connection error')
    }
}



module.exports=connectDB