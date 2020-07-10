const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = new Schema({
  name: { 
    type: String
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

  Batch: { 
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
profile : {
   type: String
 },

 gender : {
   type: String

 },

  isVerify: { 
    type: Boolean 
  
  },
});

// Export the model
module.exports = mongoose.model("users", userSchema);
