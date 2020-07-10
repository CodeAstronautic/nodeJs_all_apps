const Users = require("../models/student.model");
const config = require("../../config/database.config");
//const crypto = require("crypto")
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require("jsonwebtoken");
var key = config.secret;
//const multer = require('multer')
//const path = require('path')
//const upload = multer({dest: 'upload/'})
//const mailgun = require("mailgun-js");
//const { use } = require("passport");
//const { pathToFileURL } = require("url");


//hash password encryprion

async function encrypt(password) {
  return await bcrypt.hash(password, saltRounds)
}

async function decrypt(encrypted, hash) {
  return await bcrypt.compare(encrypted, hash);
}

//create user...............

exports.createUser = (req, res) => {
  Users.find({ email: req.body.email }, async (err, user) => {
    if (err) {
      res.json({
        status: false,
        statusCode: 404,
        message: "Error while getting student",
        error: err
      });
    } else {
      if (user.length > 0) {
        var user1 = {
          Status: user[0].Status,
          password: user[0].password,
          name:user[0].name,
          email: user[0].email,
          Batch: user[0].Batch,
          Phone_number: user[0].Phone_number,
          Address: user[0].Address,
          pincode: user[0].pincode,
          profile : user[0].profile,
          gender: user[0].gender,
          isVerify: false
        };

        //let password = await encrypt(req.body.password);
const token = jwt.sign({name : req.body.name , email: req.body.email , password: req.body.password ,Batch : req.body.Batch,Phone_number: req.body.Phone_number ,pincode: req.body.pincode,profile : req.file.filename , gender: req.body.gender}, key)
const nodemailer = require('nodemailer'); 

let mailTransporter = nodemailer.createTransport({ 
    //service: 'gmail', 
    //pool: true,
	host: 'smtp.gmail.com',
	port: 587,
	secure: false,
	auth: { 
		user: 'pm.globaliasoft@gmail.com', 
		pass: 'Password123#'
	} ,
	tls: {
		rejectUnauthorized: false
	}
}); 

let mailOption = { 
	from: 'poojam9904@gmail.com', 
	to: req.body.email, 
	subject: 'Test mail', 
  html: `<h2>PLease click on link given below - </h2>
  <a href="token">${token}</a> `
}; 

mailTransporter.sendMail(mailOption, function(err, info) { 
	if(err) { 
		console.log(err); 
	} else { 
		console.log('Email sent successfully'); 
//		console.log(info);
	} 
}); 
 
         // console.log(body);
          res.json({
            status: true,
            statusCode: 204,
            message: "Email already in use",
            data: user1
          });
       
        
      } else {
        let password = await encrypt(req.body.password);

        let createUser = new Users({
          email: req.body.email,
          password: password,
          name: req.body.name,
          Batch: req.body.Batch,
          Phone_number: req.body.Phone_number,
          Address: req.body.Address,
          pincode: req.body.pincode,
          profile: req.file.filename,
          gender: req.body.gender,
          isVerify: false
        });

        createUser.save(function (err, user) {
          if (err) {
            res.json({
              status: false,
              statusCode: 404,
              message: "Student not created ",
              error: err
            });
  
          } else {
            res.json({
              status: true,
              statusCode: 200,
              message: "Student  created  Successfully",
              data: user
            });
          }
        });
      }
    }

  });
};

//user login...............

exports.varifyemail = (req, res) => {
 
  var decoded = jwt.verify(req.params.token, key);
 // console.log(req.params.token)
  //console.log(req.body.email)
  Users.findOneAndUpdate(
   { email: decoded.email },
    { $set: { isVerify: true } },
    { new: true },
    (err, user) => {
      if (err) {
       
        res.json({
          status: false,
          statusCode: 404,
          message: "Student not verify ",
          error: err
        });
      } else {
        if (user) {
          var token = jwt.sign({ email: user.email}, key, {
            expiresIn: "8h"
          });
          res.json({
            status: true,
            statusCode: 200,
            message: "Student Successfully login",
            token,
            user
          });
        } else {
          res.json({
            status: true,
            statusCode: 404,
            message: "Student not verify with this email successfully",
            data: []
          });
        }
      }
    }
  );
};

`
exports.userLogin = (req, res) => {
  try {
    Users.find({ email: req.body.email }, async (err, user) => {
      if (err) {
        res.json({
          status: false,
          statusCode: 404,
          message: "Error while getting user",
          error: err
        });
      } else {
        if (user.length > 0) {
          const password = await decrypt(req.body.password, user[0].password);
          if (password === true) {
            const token = jwt.sign({ email: user[0].email }, key, {
              expiresIn: "8h"});
             

            res.json({
              status: true,
              statusCode: 200,
              message: "user login successfully",
              data: { user: user[0], token}
            });
          
          } else {
            res.json({
              status: false,
              statusCode: 404,
              message: "You have enter wrong password",
              error: err
            });
          }
        } else {
          res.json({
            status: false,
            statusCode: 404,
            message: "User not found"
          });
        }
      }
    });
  } catch (error) {
    res.status(400).send(error)
  }
}
`
//get user by email


exports.getUserByEmail = (req, res) => {
  try {
   
    Users.find({ email: req.body.email }, async (err, user) => {
      if (err) {
        res.json({
          status: false,
          statusCode: 404,
          message: "Student not get successfully",
          error: err
        });
      } else {
        if (user.length > 0) {
          res.json({
            status: true,
            statusCode: 200,
            message: "Student get successfully",
            data: user
          });
        } else {
          res.json({
            status: true,
            statusCode: 404,
            message: "student not found with this email",
            data: user
          });
        }
      }
    });
  } catch (err) {
    res.json({
      status: false,
      statusCode: 401,
      message: "Unauthorization student",
      data: err
    });
  }
};

//update user...............


exports.updateUser = (req, res) => {
  

var updatedate = req.body;
  updatedate.date_updated = new Date();
  Users.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true },
    (err, user) => {
      if (err) {
        res.json({
          status: false,
          statusCode: 404,
          message: "STudent not update successfully",
          error: err
        });
      } else {
        res.json({
          status: true,
          statusCode: 200,
          message: "student update successfully",
          data: user
        });
      }
    }
  );
};

//delete user...............

exports.deleteUser = function(req, res) {
  Users.findOneAndRemove(req.userId, function(err) {
    if (err) {
      res.json({
        status: false,
        statusCode: 404,
        message: "student not delete successfully",
        error: err
      });
    } else {
      res.json({
        status: true,
        statusCode: 200,
        message: "student delete successfully"
      });
    }
  });
};

//get user list ............

exports.getAll = (req, res) => {
  Users.find()
  .then(users => {
     res.send(users);
    // res.send("hii")
  }).catch(err => {
      res.status(500).send({
          message: err.message || "Some error occurred while retrieving notes."
      });
  });
};



exports.getUserById = (req, res) => {
  try {
   
    Users.findById({ id: req.params.id }, async (err, user) => {
      if (err) {
        res.json({
          status: false,
          statusCode: 404,
          message: "student not get successfully",
          error: err
        });
      } else {
        if (user.length > 0) {
          res.json({
            status: true,
            statusCode: 200,
            message: "student get successfully",
            data: user
          });
        } else {
          res.json({
            status: true,
            statusCode: 404,
            message: "student not found with this email",
            data: user
          });
        }
      }
    });
  } catch (err) {
    res.json({
      status: false,
      statusCode: 401,
      message: "Unauthorization student",
      data: err
    });
  }
};

//reset password..................==================

exports.resetpassword = async (req, res) => {
  var password = await encrypt(req.body.password);
  
  var decoded = null;
  if (req.headers.token) {
    decoded = jwt.verify(req.headers.token, key);
   console.log(req.headers.token)
  }
  var email = decoded ? decoded.email : req.body.email;
  console.log(req.body.email)
  console.log(decoded)
  Users.findOneAndUpdate(
    { email: email },
    { $set: { password: password } },
    { upsert: true },
    (err, Users) => {
      if (err) {
        console.log(err)
        res.json({
          status: false,
          statusCode: 404,
          message: "student not verify email successfully",
          error: err
        });
      } else {
        res.json({
          status: true,
          statusCode: 200,
          message: "Password Changed successfully"
        });
      }
    }
  );
};
