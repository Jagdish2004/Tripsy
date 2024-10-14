const express = require('express');
const router = express.Router();
const Listing = require("../models/listing");
const joiSchema = require("../models/joiSchema");
const {Auth} = require('../middleware/midd');
const ejs = require('ejs');
const wrapAsync = require('../utils/wrapAsync');
const expressError = require('../utils/expressError');


router.get("/", wrapAsync(async (req,res)=>{
    let listing = await Listing.find();
    res.render("index",{listing});

}));

//creating new properties
router.get("/newProperty",Auth,(req,res)=>{
    res.render("newProperty");

});

router.post("/newProperty", wrapAsync(async (req, res, next) => {
   const { error, value } = joiSchema.validate(req.body, { abortEarly: false });
   
   if (error) {
       return res.status(400).json({
           status: 'error',
           message: error.details.map(detail => detail.message).join(', ')
       });
   }

   const list = new Listing(value); // Use the validated value
   await list.save();
   req.flash('success', 'Listing Created Successfully!');
   res.redirect("/Tripsy");
})); 


// detail view of properties
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    // Populate reviews in the list object
    let list = await Listing.findById(id).populate('reviews').exec(); 
    if(!list){
        req.flash('error', 'Requested listing does not Exist!');
        res.redirect("/Tripsy");
        
    }
    res.render("detail", { list });
}));

//updating the details of properties

router.get("/:id/edit",Auth,wrapAsync(async (req, res) =>{
    let {id} = req.params;
    let list = await Listing.findById(id);
    if(!list){
        req.flash('error', 'Requested listing does not Exist!');
        res.redirect("/Tripsy");
        
    }
    res.render("editProperty",{list});
}));
router.post("/:id/edit", wrapAsync(async (req, res,next) =>{
    let {id} = req.params;
    let list = req.body;
    
        await Listing.findByIdAndUpdate(id, list,{new:true});
        req.flash('success', 'Listing Updated Successfully!');
        res.redirect(`/Tripsy/${id}`);    
}));

//deleting list
router.get("/:id/delete", wrapAsync(async (req, res) =>{
    let {id} = req.params;
    let list = await Listing.findByIdAndDelete(id);
    req.flash('success', 'Listing Deleted Successfully!');
    res.redirect("/Tripsy");
    
}));

module.exports = router;
