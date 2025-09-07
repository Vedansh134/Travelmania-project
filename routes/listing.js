const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");

// require multer for multipart/form data upload
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage }); // for store data in destination : "uploads folder"

// use router route
router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.createNewListing)
    );
// .post( upload.single('listing[image]'), (req,res) => {
//     res.send(req.file);
    // use req.file for file related data
//});

// route for create new listing by form
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(
        isLoggedIn,
        isOwner,
        upload.single('listing[image]'), // middleware
        validateListing,
        wrapAsync(listingController.updateListing)
    )
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing)
    );


//route for edit a form
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));


module.exports = router;
