const mongoose = require('mongoose')
const Schema = mongoose.Schema;
//const image = require("../../image/p")


let taskSchema = new Schema ({
    name : { 
        type: String,
        required: true,
        unique: false
    } ,

    email : {
        type: String,
        required: true,
        unique: true
    } , 

    password : {
        type: String,
        required: true
    } , 

    description: { 
        type: String ,
        required : true
    },

    date_created: { 
        type: Date 
    },

    editable: { 
        type: Boolean, 
        default: true 
    },
    isVerify: {
        type : Boolean
    }


});

module.exports = mongoose.model("task" , taskSchema);