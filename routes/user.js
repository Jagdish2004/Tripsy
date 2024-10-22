const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const expressError = require('../utils/expressError');
const passport = require('passport');
const { saveUrl } = require('../middleware/midd');
const userController = require('../controller/user')

router.get("/signup",userController.signupForm);
router.post("/signup", wrapAsync(userController.signup));
router.get("/login",userController.loginForm);

router.post("/login",saveUrl,passport.authenticate("local" , {
    failureRedirect: '/login',
    failureFlash: true}),
    userController.login
    );

router.get("/logout",userController.logout);



module.exports = router;