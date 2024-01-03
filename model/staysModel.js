// const { object, string } = require('joi');
const mongoose = require('mongoose');

const staysModel = new mongoose.Schema({
    host_id :{type:mongoose.Schema.Types.ObjectId,ref:"properties"},
    verified:{
        type:Boolean,
        default:false
    },
    propertyType:{
        type:String,
        required:true
    },
    stayType:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    address:{
        type:Object,
        required:true
    },
    maxGuests:{
        type:Number,
        required:true
    },
    bedRooms:{
        type:Number,
        required:true
    },
    beds:{
        type:Number,
        required:true
    },
    bathrooms:{
        type:Number,
        required:true
    },
    amenities:{
        type:Array,
        required:true
    },
    images:{
        type:Array,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    }

})

module.exports = mongoose.model("properties",staysModel)