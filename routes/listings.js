const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
// const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const ejsMate = require("ejs-mate");
const mongoose = require('mongoose');
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");

const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

const ListingController = require(
    "../controllers/listings.js"
)

router
  .route("/")
  .get(wrapAsync(ListingController.index))
  .post( isLoggedIn, upload.single('listing[image]'),validateListing, 
    wrapAsync(ListingController.createListing));
  // // .post(upload.single('listing[image]'), (req,res)=>{
  // //   res.send(req.file);
  // });

  router.get("/new",isLoggedIn,ListingController.renderNewForm);  

router.route("/:id")
.get(wrapAsync(ListingController.showListing))
.put(isLoggedIn,isOwner, upload.single('listing[image]'),validateListing,wrapAsync(ListingController.updateListing))
.delete(isLoggedIn,isOwner, wrapAsync(ListingController.destoryListing));


//Edit Route
router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync(ListingController.renderEditForm)
);


//===========

// //listing -> Index
// router.get("/",wrapAsync(ListingController.index));

//New route
// app.get("/new",wrapAsync(async (req,res) =>{
//     res.render("listings/new.ejs");
//  }));



// //show route
// router.get("/:id",wrapAsync(ListingController.showListing));

// //create route.
// router.post("/", isLoggedIn, validateListing, wrapAsync(ListingController.createListing)
// );

// //Edit Route
// app.get("/listings/:id/edit",validateListing, wrapAsync(async (req, res) => {
//     let { id } = req.params;
//       console.log(id);
//     // const listing = await Listing.findById(id);
//     // res.render("listings/edit.ejs", { listing });
//   }));
  
  
//Edit Route
// app.get("/listings/:id/edit", async (req, res) => {
//     try{
//     let { id } = req.params;
//     const listing = await Listing.findById(id);
//     res.render("listings/edit.ejs", { listing });
//     }catch(err){
//         next(err);
//     }
//   });


//   //Update Route
// router.put("/:id",isLoggedIn,isOwner, validateListing,wrapAsync(ListingController.updateListing));

// router.delete("/:id", isLoggedIn,isOwner, wrapAsync(ListingController.destoryListing));


module.exports = router;