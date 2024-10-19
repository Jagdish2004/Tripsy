const Listing = require("../models/listing");

module.exports.Auth = (req,res,next) =>{
        if(!req.isAuthenticated()){
            req.session.redirectUrl = req.originalUrl;
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

module.exports.isOwner =async(req,res,next)=>{
    let {id} = req.params;
    let list = await Listing.findById(id);
     if(!res.locals.currUser._id.equals(list.owner._id)){ 
        req.flash('error', 'Only Owner can Change the Listing');
        return res.redirect(`/Tripsy/${id}`);
     }
     next();
}
