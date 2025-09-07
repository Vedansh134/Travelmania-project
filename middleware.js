const Listing = require("./models/listing");
const Review = require("./models/listing");
const expressError = require("./utils/expressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
    console.log(req.user);
    if (!req.isAuthenticated()) {
        //redirect url
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create new listing!");
        return res.redirect("/login");
    };
    next();
};
// req object ke andar session object hai ,,,jike andar session related sari infomation hoti hai and we created new parameter redirectUrl

//console.log(req.user); // request obj me user related info. save hoti hai and this info is triggered to req.isAuthenticated ki user hai ya nahi

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    };
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not owner of this listing");
        return res.redirect(`/listings/${id}`);
    };
    next();
};

module.exports.validateListing = (req, res, next) => {
    let result = listingSchema.validate(req.body);
    console.log(result);
    // if(result.error){
    //     throw new expressError(400,result.error);
    // }; now this below after modify
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expressError(400, errMsg);
    } else {
        next();
    };
};

module.exports.validateReview = (req, res, next) => {
    let result = reviewSchema.validate(req.body);
    console.log(result);
    // if(result.error){
    //     throw new expressError(400,result.error);
    // }; now this below after modify
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expressError(504, errMsg);
    } else {
        next();
    };
};

// for check owner of review

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    console.log("above review it is : ", review);
    console.log("review id : ", reviewId);

    if (!review) { //Check if review is null
        req.flash("error", "Review not found"); //More informative error message
        return res.redirect(`/listings/${id}`);
    }

    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not author of this review");
        return res.redirect(`/listings/${id}`);
    };
    next();
};


