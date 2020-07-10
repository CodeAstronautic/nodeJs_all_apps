
const mongoose = require("mongoose");
const Schema = mongoose.Schema;



let userSchema = new Schema({   
    name: {
        type: String,
        required: true
    },
    email: { 
      type: String, 
      required: true, 
      unique: true 
    },

    password: { 
        type:  String , 
        default: false
    },

    Qualification: { 
        type: String 
    },

    Phone_number: { 
        type: String 
    },
    Address : {
       type: String,
       required: true
    },
    pincode : {
        type: String
    },

    isVerify: { 
        type: Boolean 
    }
    
});

// Export the model
module.exports = mongoose.model("users", userSchema);
