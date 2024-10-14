const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ejs = require('ejs');
const path = require('path');
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const home = require("./routes/home.js");
const User = require('./routes/user.js')
const userSchema =require('./models/user.js');
const methodOverride = require('method-override');
const expressError = require('./utils/expressError');
const session = require('express-session');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local');
engine = require('ejs-mate');


// Setting the paths of directories
app.engine('ejs', engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Linking the database
main().then(() => {
    console.log("connected to mongoDB");
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/Tripsy');
}

// Starting the server
const port = 3000;
app.listen(port, () => {
    console.log(`listening on port: ${port}`);
});


// session && flash settings
const sessioninfo = {
    secret: 'ThisIsSoSecret',
    resave: false,  
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        secure: false, 
        httpOnly: true,
        sameSite: 'Lax',
    },
};
app.use(session(sessioninfo));
app.use(flash());
app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(userSchema.authenticate()));
passport.serializeUser(userSchema.serializeUser());
passport.deserializeUser(userSchema.deserializeUser());

//middleware for flashing messages
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.username = req.flash('username');
    res.locals.email = req.flash('email');
    next();
});

// Home routes
app.use("/", home);

//user routes
app.use("/", User);

// Listing routes
app.use("/Tripsy", listings);

// Review routes
app.use("/Tripsy/:id/review", reviews);

// Error handling
app.all("*", (req, res, next) => {
    next(new expressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong, try again after some time!" } = err;
    res.status(statusCode).render("error", { message });
});




