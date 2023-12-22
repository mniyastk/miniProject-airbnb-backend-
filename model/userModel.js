const mongoose =require('mongoose');

const userModel= new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:false
    },
    profilePicture:{
        type:String
    },
    phone:{
        type:String,
        required:false
    },
    userType:{
        type:String,
        default:"user"
    },
    bookings:[],
    whishLists:[{type:mongoose.Schema.Types.ObjectId,ref:"properties"}],
    listings:{
        type:Array
    }
})

module.exports=mongoose.model("users",userModel);