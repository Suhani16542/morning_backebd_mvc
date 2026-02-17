const express = require("express");
const app = express();

const { signup, login, sendOTP, verifyOTP,updateProfile ,getAllUser,getUserById } = require("../Controllers/user.controller");

const { authenticate, authorize } = require("../middleware/auth.middleware");


app.post("/signup", signup);
app.post("/login", login);
app.post("/send-otp", sendOTP);
app.post("/verify-otp", verifyOTP);
app.post("/getallUser", authenticate, authorize("admin",), getAllUser);
app.put("/update-profile/:id", authenticate, updateProfile);
app.get("/getUserById/:id", getUserById);


// admin new endpoint
// getAllUser ( fetch all db user allrole)
// active/deavctive user by userid
//  delete user by id// 
// create crud operation for employee (create,update,delete,edit)
//  create crud operation for sub-admin (create,update,delete,edit)
//  getallform (acitive or deactive both)//
//  user new end pointb 
//  create profile , update profile  (user id)// 
// getProfileComplete_percentage


module.exports = app;