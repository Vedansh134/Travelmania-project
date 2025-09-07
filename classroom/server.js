const express = require("express");
const app = express();
const port = 3000;
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const cookieParser = require("cookie-parser");

//app.use(cookieParser());
app.use(cookieParser("secretcode"));

app.get("/getCookie", (req,res)=>{
    res.cookie("greet","namaste");
    res.cookie("origin","india");
    res.send("we are practising cookie currently now");
});

app.get("/greet",(req,res)=>{
    let { name="anonymous" } = req.cookies;
    res.send(`hello ${name}`);
});

app.get("/",(req,res)=>{
    console.dir(req.cookies);
    res.send("i am get method working");
});

// for send signed cookies
app.get("/getsignedcookie",(req,res)=>{
    res.cookie("color","red",{ signed:true });
    res.send("done");
});

// for verify the cookies
app.get("/verify", (req,res)=>{ 
    console.log(req.signedCookies);
    console.log(req.cookies);
    res.send(req.signedCookies);
});

app.use("/users", users);
app.use("/posts", posts);

app.listen(port, ()=>{
    console.log("listen on port no 3000");
});

