const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync');
const {Auth,isReviewOwner } = require("../middleware/midd");
const reviewController = require('../controller/review');


router.post("/newReview", Auth,reviewController.newReview);
router.delete("/:reviewId/deleteReview", Auth,isReviewOwner, wrapAsync(reviewController.destroyReview));


module.exports = router;