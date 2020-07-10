//call model (database)..........
const bcrypt = require('bcrypt')
const Users = require("../models/user.model")
// call database file.......
const config = require("../../config/db.config")
const saltRounds = 10;
const mailgun = require("mailgun-js");
const DOMAIN = 'sandbox6f2d7a30a6cb44478559c8b9e7a76c3d.mailgun.org';
const mg = mailgun({apiKey: "7705a98bd4fc3025718677165be8fe1a-913a5827-9c6408d3", domain: DOMAIN});

var jwt = require("jsonwebtoken");
const { json } = require('body-parser');
var key = config.secret;


async function encrypt(password) {
    return await bcrypt.hash(password, saltRounds)
  }
  
  async function decrypt(encrypted, hash) {
    return await bcrypt.compare(encrypted, hash);
  }
  


//user create

  exports.createUser = (req, res) => {
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
          var user1 = {
            Status: user[0].Status,
            password: user[0].password,
            email: user[0].email,
            firstName: user[0].firstName,
            lastName: user[0].lastName,
            isVerify: false
          };
          
  
          const data = {
            from: 'noreply@hello.com',
            to: req.body.email,
            subject: 'Hello',
            html: ' successfully'
          };
          
          
          mg.messages().send(data, function (error, body) {
            console.log(error);
            res.json({
              status: true,
              statusCode: 204,
              message: "Email already in use",
              data: user1
            });
          });
          
  
  
        } else {
          let password = await encrypt(req.body.password);
  
          let createUser = new Users({
            email: req.body.email,
            password: password,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            isVerify: false
          });
  
          createUser.save(function (err, user) {
            if (err) {
              res.json({
                status: false,
                statusCode: 404,
                message: "User not created ",
                error: err
              });
     
            } else {
              res.json({
                status: true,
                statusCode: 200,
                message: "User created ",
                data: user
              });
            }
          });
        }
      }
  
    });
  };
  
  //login and generate token...........

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
                expiresIn: "8h"
              });
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
  
  
//get alll user list
  exports.getAll = (req, res) => {
    Users.findById()
    .then(users => {
        res.send(users);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving notes."
        });
    });
  };
  

//verify with token 

exports.varifyemail = (req, res) => {
 
    var decoded = jwt.verify(req.headers.token, key);
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
            message: "User not verify ",
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
              message: "User Verify ",
              token,
              user
            });
          } else {
            res.json({
              status: true,
              statusCode: 404,
              message: "User not verify with this email successfully",
              data: []
            });
          }
        }
      }
    );
  };

  //get user via mail

exports.getUserByEmail = (req, res) => {
    try {
     
      Users.find({ email: req.body.email }, async (err, user) => {
        if (err) {
          res.json({
            status: false,
            statusCode: 404,
            message: "User not get successfully",
            error: err
          });
        } else {
          if (user.length > 0) {
            res.json({
              status: true,
              statusCode: 200,
              message: "user get successfully",
              data: user
            });
          } else {
            res.json({
              status: true,
              statusCode: 404,
              message: "user not found with this email",
              data: user
            });
          }
        }
      });
    } catch (err) {
      res.json({
        status: false,
        statusCode: 401,
        message: "Unauthorization user",
        data: err
      });
    }
  };
  

//reset password..........

exports.resetpassword = async (req, res) => {
    var password = await encrypt(req.body.password);
    
    var decoded = null;
    if (req.headers.token) {
      decoded = jwt.verify(req.headers.token, key);
     // console.log(req.headers.token)
    }
    var email = decoded ? decoded.email : req.body.email;
    //console.log(req.body.email)
    //console.log(decoded)
    Users.findOneAndUpdate(
      { email: email },
      { $set: { password: password } },
      { upsert: true },
      (err, user) => {
        if (err) {
          console.log(err)
          res.json({
            status: false,
            statusCode: 404,
            message: "User not verify email successfully",
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
  

//@access Public
  exports.update = async function (req, res) {
      try {
          const update = req.body;
          const id = req.params.id;
          const userId = req.user._id;
  
          //Make sure the passed id is that of the logged in user
          if (userId.toString() !== id.toString()) return res.status(401).json({message: "Sorry, you don't have the permission to upd this data."});
  
          const user = await User.findByIdAndUpdate(id, {$set: update}, {new: true});
  
          //if there is no image, return success message
          if (!req.file) return res.status(200).json({user, message: 'User has been updated'});
  
          //Attempt to upload to cloudinary
          const result = await uploader(req);
          const user_ = await User.findByIdAndUpdate(id, {$set: update}, {$set: {profileImage: result.url}}, {new: true});
  
          if (!req.file) return res.status(200).json({user: user_, message: 'User has been updated'});
  
      } catch (error) {
          res.status(500).json({message: error.message});
      }
  };