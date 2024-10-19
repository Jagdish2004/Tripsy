module.exports.Auth = (req,res,next) =>{
        if(!req.isAuthenticated()){
            req.session.redirectUrl = req.originalUrl;
            console.log(req.session.redirectUrl);
            req.flash('error' ,'You Need to be Login');
            return res.redirect('/login');
        }
        next();
    }

module.exports.saveUrl = (req,res,next)=>{
    if( req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;  
    }
    next();

}
