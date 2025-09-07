const Listing = require("../models/listing");
const review = require("../models/review");

// controller for reviews

module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new review(req.body.review);

    newReview.author = req.user._id;
    console.log(newReview);

    console.log(req.params.id);
    listing.review.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("review saved");
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
};

// route for delete review
module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
};