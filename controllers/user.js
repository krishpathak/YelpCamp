const User= require('../models/userdata');
const passport = require('passport');

module.exports.showRegister=async (req,res)=>{
    res.render('users/register')
}

module.exports.register=async (req,res)=>{
    try{
    const {email,username,password}=req.body;
    const userexist= await User.findOne({email});
    if(!userexist){
    const user= new User({email,username});
    const registeredUser= await User.register(user,password);
    console.log(req.isAuthenticated());
    req.flash('success', ' Welcome to YelpCamp!!');
    res.redirect('/campground');}
    else{
        req.flash('error','Person with this email id already exist');
        res.redirect('/register')
    }
    }catch(e){
        console.log(e)
        req.flash('error',e.message);
        res.redirect('/register')
    }
}

module.exports.getLogin=(req,res)=>{
    res.render('users/login')
}

module.exports.Login=(req,res)=>{
    req.flash('success','Welcome Back');
    const redirect = req.session.returnTo ||'campground'
    console.log(req.session.returnTo)
    res.redirect(redirect)
}

module.exports.logout=(req, res, next) => {
    req.logout((err)=>{
        if(err){
            res.send("Some Erro");
        }
        else{
            req.flash('success',"Successfully logout");
            res.redirect('/login')
        }
    });
  }