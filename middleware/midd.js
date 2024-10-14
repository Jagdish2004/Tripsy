module.exports.Auth = (req,res,next) =>{
        if(!req.isAuthenticated()){
            req.flash('error' ,'You Need to be Login');
            return res.redirect('/login');
        }
        next();
    }
