const Listing = require("../models/listing");
const Review = require("../models/reviews"); 

module.exports.Auth = (req, res, next) => {
    if (!req.isAuthenticated()) {
        const currentUrl = req.originalUrl;

        // Save the current URL to session ONLY if it's meaningful
        if (!['/login', '/signup', '/logout','/review/'].includes(currentUrl)) {
            req.session.redirectUrl = currentUrl;
        }

        req.flash('error', 'You need to be logged in.');
        return res.redirect('/login');
    }
    next();
};


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

module.exports.isReviewOwner = async(req,res,next)=>{
    let {reviewId,id} = req.params;
    let review = await Review.findById(reviewId);
     if(!res.locals.currUser._id.equals(review.owner._id)){ 
        req.flash('error', 'Only Writer an delete review');
        return res.redirect(`/Tripsy/${id}`);
     }
     next();
}
