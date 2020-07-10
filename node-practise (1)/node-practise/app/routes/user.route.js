const express = require("express")
const router = express.Router()
const multer = require('multer')
const users_controller = require("../controllers/user.controller");


const upload = multer().single('profileImage');
router.post("/createuser", users_controller.createUser)
router.post("/userlogin" , users_controller.userLogin)
router.post("/getAll",users_controller.getAll)
router.post("/verify",users_controller.varifyemail)
router.post("/getUserByEmail", users_controller.getUserByEmail)
router.post("/reset", users_controller.resetpassword)

//UPDATE
router.put('/:id', upload, users_controller.update);
module.exports = router;