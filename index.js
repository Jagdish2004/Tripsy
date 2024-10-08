const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ejs = require('ejs');
const path = require('path');
const Listing = require("./models/listing");
const reviews = require("./models/reviews");
const joiSchema = require("./models/joiSchema");
const joiReview = require("./models/joiReview");
const methodOverride = require('method-override');
const wrapAsync = require('./utils/wrapAsync');
const expressError = require('./utils/expressError');
engine = require('ejs-mate');



//setting the paths of directies..............

app.engine('ejs', engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname,"public")));
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//linking the database
main().then(()=>{
    console.log("connected to mongoDB");
}).catch(err => console.log(err));

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/Tripsy');
}

//starting the server
const port = 3000;
app.listen(port,()=>{
    console.log(`listning on port: ${port}`);
});

//creating our main routes
app.get("/",(req,res)=>{
    res.render("home");
});

app.get("/Tripsy/", wrapAsync(async (req,res)=>{
    let listing = await Listing.find();
    res.render("index",{listing});

}));

//creating new properties

app.get("/Tripsy/newProperty",(req,res)=>{
     res.render("newProperty");

});

app.post("/Tripsy/newProperty", wrapAsync(async (req, res, next) => {
    const { error, value } = joiSchema.validate(req.body, { abortEarly: false });
    
    if (error) {
        return res.status(400).json({
            status: 'error',
            message: error.details.map(detail => detail.message).join(', ')
        });
    }

    const list = new Listing(value); // Use the validated value
    await list.save();
    res.redirect("/Tripsy");
}));


// detail view of properties
app.get("/Tripsy/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    // Populate reviews in the list object
    let list = await Listing.findById(id).populate('reviews').exec(); 
    res.render("detail", { list });
}));

//updating the details of properties

app.get("/Tripsy/:id/edit",wrapAsync(async (req, res) =>{
    let {id} = req.params;
    let list = await Listing.findById(id);
    res.render("editProperty",{list});
}));
app.post("/Tripsy/:id/edit", wrapAsync(async (req, res,next) =>{
    let {id} = req.params;
    let list = req.body;
    
        await Listing.findByIdAndUpdate(id, list,{new:true});
        res.redirect(`/Tripsy/${id}`);    
}));

//deleting list
app.get("/Tripsy/:id/delete", wrapAsync(async (req, res) =>{
    let {id} = req.params;
    let list = await Listing.findByIdAndDelete(id);
    res.redirect("/Tripsy");
    
}));

//review routes
app.post("/Tripsy/:id/newReview", async (req, res) => {
    let { id } = req.params;

    const { error, value } = joiReview.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            status: 'error',
            message: error.details.map(detail => detail.message).join(', ')
        });
    }

    let review = new reviews(value);

    await review.save();
    let list = await Listing.findById(id);
    list.reviews.push(review._id);
    await list.save(); 
    res.redirect(`/Tripsy/${id}`);
});

// delete review
app.delete("/Tripsy/:id/deleteReview", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const { reviewId } = req.body;

    let review = await reviews.findByIdAndDelete(reviewId);
    console.log(review);
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    res.redirect(`/Tripsy/${id}`);
}));



//error handling

app.all("*",(req,res,next)=>{
    next(new expressError(404,"page not found!"));
});

app.use((err,req,res,next) =>{
    
    let{statusCode =500,message ="something went wrong try again after some time! "} = err;
    res.status(statusCode).render("error",{message});
});




