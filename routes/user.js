const express = require('express');
const router = express.Router();
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const expressError = require('../utils/expressError');
const passport = require('passport');
const { saveUrl } = require('../middleware/midd');

router.get("/signup", (req, res) => {
    res.render("users/signUp");
  });

router.post("/signup", wrapAsync(async (req, res) => {
    const { username, email, password } = req.body;
    let user = new User({ username, email });
  
    try {
      const registeredUser = await User.register(user, password);

      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash('success', 'Welcome to Tripsy!');
        return res.redirect('/Tripsy');
      });

    } catch (err) {

      req.flash('error', err.message);
      req.flash('username', username);
      req.flash('email', email);
      return res.redirect('/signup');
    }
  }));
  

router.get("/login",(req,res)=>{
    res.render("users/login");
});

router.post("/login",saveUrl,passport.authenticate("local" , {
    failureRedirect: '/login',
    failureFlash: true}),
    
    async (req,res)=>{
        req.flash('success','Welcome back to Tripsy!');
        let redirectUrl = res.locals.redirectUrl || "/Tripsy";
        if (redirectUrl === "/login") {
          redirectUrl = "/Tripsy";
        }
    
        delete req.session.redirectUrl;
        
        res.redirect(redirectUrl);
});

router.get("/logout",(req,res)=>{
  req.logout((err) => {
    if (err) {
        req.flash('error' , 'Error, Try again after some time');
    }
    req.flash('success', 'You have been logged out successfully.');
    res.redirect('/tripsy'); 
});

});



module.exports = router;