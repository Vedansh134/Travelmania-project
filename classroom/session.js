const express = require("express");
const app = express();
const port = 3000;
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
// const users = require("./routes/user.js");
// const posts = require("./routes/post.js");
// const cookieParser = require("cookie-parser");

// use session as a middleware

const sessionOption = {
    secret : "this side vedansh kumar",
    resave : false,
    saveUninitialized : true
}
app.use(session(sessionOption));
app.use(flash());

app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/requestcount",(req,res)=>{
    if(req.session.count){   // req.session track single session
        req.session.count++;
    }else{
        req.session.count=1;
    }
    res.send(`you send a request ${req.session.count} times`);
});

// Session {
//     cookie: { path: '/', _expires: null, originalMaxAge: null, httpOnly: true }
//   }   we can create new variable like in above count

// storing and using session info
app.get("/register",(req,res)=>{
    let {name="anonymous"} = req.query;
    req.session.name = name;

    if(name === "anonymous"){
        // use flash pass a key and msg
        req.flash("error","user not registered!");
    }else{
        req.flash("success","user registered successfully!");
    };
    
    console.log(req.session);
    //res.send(`your name is ${name}`);
    res.redirect("/hello");
});

app.get("/hello",(req,res)=>{
    //res.send(`hello ${req.session.name}`);
    res.locals.successMsg = req.flash("error");
    res.locals.errorMsg = req.flash("success");
    res.render("page.ejs",{name : req.session.name});

    //res.render("page.ejs",{name : req.session.name, msg : req.flash("success")});
    // Interestingly after 1st refresh this msg was remove !!
});

// so request on different routes a single session are running so we store info and use them 

app.listen(port, ()=>{
    console.log("listen on port no 3000");
});