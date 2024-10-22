const User = require('../models/user');
//signUp get/post
module.exports.signupForm = (req, res) => {
    res.render("users/signUp");
  }

module.exports.signup = async (req, res) => {
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
  }

//login get/post
module.exports.loginForm = (req,res)=>{
    res.render("users/login");
}

module.exports.login = async (req,res)=>{
    req.flash('success','Welcome back to Tripsy!');

    
    let redirectUrl = res.locals.redirectUrl || "/Tripsy";
    if (redirectUrl === "/login") {
      redirectUrl = "/Tripsy";
    }
    if (redirectUrl.includes("/review/")) {
      redirectUrl = redirectUrl.replace("/review/newReview", "");
  }

    delete req.session.redirectUrl;
    
    res.redirect(redirectUrl);
}

//logout get
module.exports.logout = (req,res)=>{
    req.logout((err) => {
      if (err) {
          req.flash('error' , 'Error, Try again after some time');
      }
      req.flash('success', 'You have been logged out successfully.');
      res.redirect('/tripsy'); 
  });
 }
