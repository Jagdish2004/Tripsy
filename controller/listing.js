const Listing = require("../models/listing");
const joiSchema = require("../models/joiSchema");

module.exports.showListing = async (req,res)=>{
    delete req.session.redirectUrl;
    let listing = await Listing.find();
    res.render("index",{listing});

}
module.exports.newListingForm =(req,res)=>{
    res.render("newProperty");

}
module.exports.newListing = async (req, res, next) => {
    const { error, value } = joiSchema.validate(req.body, { abortEarly: false });
    
    if (error) {
        return res.status(400).json({
            status: 'error',
            message: error.details.map(detail => detail.message).join(', ')
        });
    }
 
    const list = new Listing(value); // Use the validated value
    list.owner = req.user._id;
    await list.save();
    req.flash('success', 'Listing Created Successfully!');
    res.redirect("/Tripsy");
 }

 module.exports.detailListing = async (req, res) => {
    let { id } = req.params;
    // Populate reviews in the list object
    let list = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate:{
            path:"owner"
        },
        })
    .populate("owner")
    .exec(); 
    if(!list){
        req.flash('error', 'Requested listing does not Exist!');
        res.redirect("/Tripsy");
        
    }
    res.render("detail", { list });
}
module.exports.updateListingForm = async (req, res) =>{
    let {id} = req.params;
    let list = await Listing.findById(id);
    if(!list){
        req.flash('error', 'Requested listing does not Exist!');
        res.redirect("/Tripsy");
        
    }
    res.render("editProperty",{list});
}

module.exports.updateListing = async (req, res,next) =>{
    let {id} = req.params;
    let list = req.body;
    
        await Listing.findByIdAndUpdate(id, list,{new:true});
        req.flash('success', 'Listing Updated Successfully!');
        res.redirect(`/Tripsy/${id}`);    
}

module.exports.destroyListing = async (req, res) =>{
    let {id} = req.params;
    let list = await Listing.findByIdAndDelete(id);
    req.flash('success', 'Listing Deleted Successfully!');
    res.redirect("/Tripsy");
    
}