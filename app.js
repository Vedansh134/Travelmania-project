if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
    //console.log(process.env);
};
//console.log(process.env.KEY) // remove this after you've confirmed it is working

const express = require("express");
const app = express();
const port = 8084;
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const mongo_url = "mongodb://127.0.0.1:27017/travelmania";
// for docker container
// const mongo_url = "mongodb://mongodb:27017/travelmania";
const path = require("path");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError.js");

//routes
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

//session and flash
const session = require("express-session");
const flash = require("connect-flash");

//passport
const passport = require("passport");
const LocalStrategy = require("passport-local");
// requires the model with Passport-Local Mongoose plugged in
const User = require("./models/user.js");

app.set("views", path.join(__dirname, "./views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public/js")));
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const sessionOption = {
    secret : "this side vedansh kumar",
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now()+7*24*60*60*1000,
        maxAge : 7*24*60*60*1000,
        httpOnly : true
    },
};

main()
    .then((res) => {
        console.log("connection successful");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(mongo_url);
};

app.get("/",(req,res)=>{
    console.log("app working");
    res.redirect("/listings");
});

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// middleware
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// use from router => listing.js and review.js and user.js
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/", userRouter);

//response for all route
app.all("*",(req,res,next)=>{
    next(new expressError(404,"page not found!"));
});

//middleware for handle error
app.use((err, req, res, next) => {
    let {status=404,message="Somethong went wrong"} = err;
    res.status(status).render("error.ejs", {message});
});

app.listen(port, () => {
    console.log(`app listen on port number ${port}`);
});

