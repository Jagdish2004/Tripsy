const Listing = require("../models/listing");
const joiSchema = require("../models/joiSchema");
const getCoordinates =require("../models/mapModel");

module.exports.showListing = async (req,res)=>{
    delete req.session.redirectUrl;
    let listing = await Listing.find();
    res.render("index",{listing});

}
module.exports.newListingForm =(req,res)=>{
    res.render("newProperty");

}
module.exports.newListing = async (req, res, next) => {

    const file = req.file || {
      path: "https://res.cloudinary.com/dfurdxjub/image/upload/v1729959568/Tripsy_DEV/bpvxmufhwpzlsmulgiue.jpg",
      filename: "No-Image-Available",
    };

    const { error, value } = joiSchema.validate(
      { ...req.body, image: { filename: file.filename, url: file.path } },
      { abortEarly: false }
    );
  
    if (error) {
      console.log(error);
      return res.status(400).json({
        status: 'error',
        message: error.details.map(detail => detail.message).join(', '),
      });
    }
  
    try {
      const list = new Listing(value);
      list.owner = req.user._id;
      let geometry =  await getCoordinates(list.location +"," + list.country);
      list.coordinates = geometry;
  
      await list.save();
      req.flash('success', 'Listing Created Successfully!');
      res.redirect("/Tripsy");
    } catch (err) {
      next(err);
    }
  };
  
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

module.exports.updateListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const list = { ...req.body };

    if (req.file) {
      list.image = {
        filename: req.file.filename,
        url: req.file.path,
       
      };
    }
    let geometry =  await getCoordinates(list.location +"," + list.country);
      list.coordinates = geometry;
    const updatedListing = await Listing.findByIdAndUpdate(id, list, { 
      new: true, 
      runValidators: true ,
    });

    if (!updatedListing) {
      req.flash('error', 'Listing not found!');
      return res.redirect('/Tripsy'); 
    }

    req.flash('success', 'Listing Updated Successfully!');
    res.redirect(`/Tripsy/${id}`);
  } catch (error) {
    console.error('Error updating listing:', error);
    req.flash('error', 'Something went wrong. Please try again!');
    next(error);
  }
};

module.exports.destroyListing = async (req, res) =>{
    let {id} = req.params;
    let list = await Listing.findByIdAndDelete(id);
    req.flash('success', 'Listing Deleted Successfully!');
    res.redirect("/Tripsy");
    
}