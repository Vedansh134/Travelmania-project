const User = require("../models/user.js");

// route for render signup form
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

// route for signup
module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registerUser = await User.register(newUser, password);
        console.log(registerUser);
        req.login(registerUser,(err)=>{
            if(err){
                return next(err);
            };
            req.flash("success","welcome to travelmania");
            res.redirect("/listings");
        });
    } catch (error) {
        req.flash("error",error.message);
        res.redirect("/signup");
    };
};

// route for render form for login
module.exports.renderLoginupForm = (req, res) => {
    res.render("users/login.ejs");
};

// route for login
module.exports.login = (req,res) => {
    req.flash("success","Welcome back to Travelmania!");
    //res.redirect("/listings");  // first one
    //res.redirect(req.session.redirectUrl);
    let redirectUrl = res.locals.redirectUrl || "/listings";
    //res.redirect(res.locals.redirectUrl);
    res.redirect(redirectUrl);
};

// route for logout
module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        };
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    });
};
