const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const mongo_url = "mongodb://127.0.0.1:27017/travelmania";

main()
    .then((res)=>{
       console.log("connection successful");
    })
    .catch((err)=>{
        consol.log(err);
    });

async function main(){
    await mongoose.connect(mongo_url);
};

const initDB = async () => {
    // await Listing.deleteMany({});
    // also map make new array so this is ...
    initData.data = initData.data.map((obj) => ({...obj, owner : "6703e8bbcd50f90717b8862a"}) );
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();