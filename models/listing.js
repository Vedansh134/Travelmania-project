const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const review = require("./review.js");


const listingSchema = new Schema({
    title : {
        type : String,
        required : true,
    },
    description : String,
    image : {
        url : String,
        filename : String
    },
    price : {
        type : Number,
        require : true
    },
    location : {
        type : String,
        require : true
    },
    country : {
        type : String,
        require : true
    },
    review : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review"
        }
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User",
    },
    // use geo.json
    geometry : {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    }
});

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await review.deleteMany({_id : {$in : listing.review}});
    };
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
