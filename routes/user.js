const express = require('express');
const router = express.Router();
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const expressError = require('../utils/expressError');
const passport = require('passport');

router.get("/signup", (req, res) => {
    res.render("users/signUp", {
    });
  });
router.post("/signup", wrapAsync(async (req, res) => {
    const { username, email, password } = req.body;
    let user = new User({ username, email });
  
    try {
      await User.register(user, password);
      req.flash('success', 'Welcome to Tripsy!');
      return res.redirect('/Tripsy');
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
router.post("/login",passport.authenticate("local" , {
    failureRedirect: '/login',
    failureFlash: true}),
    async (req,res)=>{
        req.flash('success','Welcome back to Tripsy!');
        res.redirect('/Tripsy');
});



module.exports = router;