const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


// store callbacks of route ===>  routes->listing.js
// index.route
module.exports.index = async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/home.ejs", { allListing });
};

// route to render form for create new listing
module.exports.renderNewForm = (req, res) => {
    return res.render("listings/new.ejs");
};

// route for add new listing
module.exports.createNewListing = async (req, res) => {
    //for map setup
    console.log(req.body);
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    })
    .send();

    // for cloudinary setup
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url, "..", filename);

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    //map
    newListing.geometry = response.body.features[0].geometry;
    console.log(response.body.features[0].geometry);
    let coor = await newListing.save();
    console.log("coordinate : ",coor);

    //await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};


// show route for individual listing
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "review",
            populate: {
                path: "author"
            },
        })
        .populate("owner");

    console.log(listing);
    console.log(listing.owner);

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    };

    res.render("listings/show.ejs", { listing });
};

// route for edit form
module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    };
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { listing });
};

// edit route
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    console.log(req.body.listing);
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    };
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Update!");
    res.redirect(`/listings/${id}`);
};

// destroy route
module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};