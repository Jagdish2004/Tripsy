const express = require('express');
const router = express.Router();

router.get("/",(req,res)=>{
    delete req.session.redirectUrl;
    res.render("home");
});

module.exports = router;