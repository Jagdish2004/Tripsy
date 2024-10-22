const reviews = require("../models/reviews");
const joiReview = require("../models/joiReview");
const Listing = require("../models/listing");

module.exports.newReview =async (req, res) => {
    let { id } = req.params;

    const { error, value } = joiReview.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            status: 'error',
            message: error.details.map(detail => detail.message).join(', ')
        });
    }

    let review = new reviews(value);
    review.owner = req.user._id;

    await review.save();
    let list = await Listing.findById(id);
    list.reviews.push(review._id);
    await list.save(); 
    req.flash('success', 'Review Added Successfully!');
    res.redirect(`/Tripsy/${id}`);
}

module.exports.destroyReview = async (req, res) => {
    const { id, reviewId} = req.params;

    await reviews.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    req.flash('success', 'Review Deleted Successfully!');
    res.redirect(`/Tripsy/${id}`);
}