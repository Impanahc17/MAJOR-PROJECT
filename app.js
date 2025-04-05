if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const ejsMate = require("ejs-mate");
const mongoose = require('mongoose');
// const Listing = require("./models/listing.js");
const path = require("path");
app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
const methodOverride = require("method-override");
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")
// const { listingSchema ,reviewSchema} = require("./schema.js")
const session = require("express-session");
const Mongostore = require("connect-mongo");
const flash = require("connect-flash");
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listings = require("./routes/listings.js");
const reviews = require("./routes/reviews.js")
const userRouter = require("./routes/user.js");

const store = Mongostore.create({
    mongoUrl : dbUrl,
    crypto :{
     secret :  process.env.SECRET,
    },touchAfter: 24 * 3600
 })

store.on("error", () =>{
    console.log("Error in MONGO SESSION Store",err);
})

const sessionOptions = {
    store,
    secret : process.env.SECRET,
resave : false,
saveUninitialized : true,
cookie :{
    expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge : 7 * 24 * 60 * 60 * 1000,
    httpOnly : true,
},
};





app.use(session(sessionOptions));
app.use(methodOverride("_method"));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
   });

const dbUrl = process.env.ATLASDB_URL;
// const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

main().then(() =>{
    console.log("connection successful");
})
.catch(err => console.log(err));

async function main() {
    await mongoose.connect(dbUrl);
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
  }


app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",userRouter);

// app.get("/testListing",async (req,res)=>{
// let sampleListing = new Listing({
//     title : "My New Ville",
//     description : "By the beach",
//     price : 1200,
//     location : "calanguate, Goa",
//     country : "India",
// })
// await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });

// app.get("/",(req,res) =>{
//     res.send("I am root");
// })


app.get("/listings/new",wrapAsync(async (req,res) =>{
   res.render("listings/new.ejs");
}));

// app.use((err,req,res,next)=>{
//     res.send("somethinge went wrong!");
// })

app.all("*", (req,res,next)=>{
    next(new ExpressError(404, "Page Not found"));
});

app.use((err,req,res,next)=>{
    // let (statusCode= 500, message = "Something went wrong") = err;
    let {statusCode= 500, message= "Something went wrong"} = err;
//    res.status(statusCode).send(message);
    res.render("Error.ejs",{err});
})





app.get("/",(req,res) =>{
    res.send("I am root");
})

app.listen(8080, () =>{
    console.log("server is listening to 8080");
})