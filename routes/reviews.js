const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router({mergeParams:true});
// const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const ejsMate = require("ejs-mate");
const mongoose = require('mongoose');
const Review = require("../models/review.js");
const {isLoggedIn,isReviewAuthor,validateReview} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js")
//review sending //post route
router.post("/",isLoggedIn, validateReview,wrapAsync( reviewController.createReview));

//delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,
    wrapAsync(reviewController.DestroyReview)
)

module.exports = router;