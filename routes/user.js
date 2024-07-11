const express= require('express');
const router= express.Router();
const User= require('../models/userdata');
const catchAsync=require('../utils/catchAsync');
const passport = require('passport');
const isLoggedIn=require('../middleware');
const user=require('../controllers/user')

router.route('/register')
.get(user.showRegister)
.post(catchAsync(user.register))

router.route('/login')
.get(user.getLogin)
.post(passport.authenticate('local',{failureFlash:'Password or Username is incorrect',failureRedirect:'/login'}),user.Login)

router.get('/logout', user.logout);
  

module.exports=router;
