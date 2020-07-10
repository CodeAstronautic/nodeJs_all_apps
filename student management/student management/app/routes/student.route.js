const express = require("express");
const router = express.Router();    
const users_controller = require("../controllers/student.controller");
const multer = require('multer')


//profile image upload...
const storage = multer.diskStorage({
    destination: "./upload",
    filename:function(req , file , cb){
 //     console.log(file)
      cb(null , Date.now() + '_' + file.originalname );
    }
  })
  
  const upload = multer({
    storage: storage,
    
      fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return cb(new Error('Only image files are allowed!'));
      }
      cb(null, true);
      
      }
    });
  
router.post("/register", upload.single('profile'),users_controller.createUser);


router.post("/getAll", users_controller.getAll);
router.post("/getAll", users_controller.getUserById);
router.post("/getUserByEmail", users_controller.getUserByEmail);
router.put("/user/:id", users_controller.updateUser);
router.delete("/user", users_controller.deleteUser);
router.post("/resetpassword", users_controller.resetpassword);
//router.post("/sendMail", reset_controller.Reset);
router.post("/userlogin/:token", users_controller.varifyemail);

module.exports = router;