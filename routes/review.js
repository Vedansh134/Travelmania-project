const express = require("express");
const router = express.Router({ mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn,isReviewAuthor,validateReview } = require("../middleware.js");

// reviews contoller
const reviewContoller = require("../controllers/reviews.js");

// ========== reviews route =============== //

// post route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewContoller.createReview));

// route for delete reviews in listings
router.delete("/:reviewId", isLoggedIn,isReviewAuthor,wrapAsync(reviewContoller.destroyReview));


module.exports = router;

