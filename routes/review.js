
const express = require('express');
const router = express.Router({mergeParams: true});
const reviews = require("../models/reviews");
const wrapAsync = require('../utils/wrapAsync');
const joiReview = require("../models/joiReview");
const Listing = require("../models/listing");


router.post("/newReview", async (req, res) => {
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
router.delete("/:reviewId/deleteReview", wrapAsync(async (req, res) => {
    const { id, reviewId} = req.params;

    let review = await reviews.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    res.redirect(`/Tripsy/${id}`);
}));


module.exports = router;