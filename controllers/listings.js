const Listing = require("../models/listing.js");

module.exports.index = async (req,res)=>{
    const allistings = await Listing.find({});
    res.render("listings/index.ejs",{allistings})
    // const allListings = await Listing.find({});
    // res.render("/listings/index.ejs",{ allListings });
}


module.exports.renderNewForm = (req,res) =>{
    res.render("listings/new.ejs");
 }


 module.exports.showListing =  async (req,res) =>{
    let {id} = req.params;
    // console.log(id);
    const listing = await Listing.findById(id)
    .populate({path:"reviews", populate :{
        path:"author"
    }})
    .populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}


module.exports.createListing = async (req,res,next)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
}


module.exports.renderEditForm =async (req, res) => {
    try{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/h_300,w_250");
    res.render("listings/edit.ejs", { listing , originalImageUrl});
    }catch(err){
        next(err);
    }
  }


//   module.exports.updateListing = async (req, res) => {
//     // console.log(req);
//     // if(!req.body.listing){
//     //     throw new ExpressError(400,"Send valid data for listings");
//     // }
    
//     await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//     req.flash("success","Listing Updated!");
//     res.redirect(`/listings/${id}`);
//   }

module.exports.updateListing =  async (req, res) => {
  let {id } = req.params;
//   let listing = await Listing.findById(id);
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file != "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
    }
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
}
  
//   if(!listing.owner._id.equals(res.locals.currUser._id)){
//     req.flash("error", "You don't have permission to edit");
//     return res.redirect(`/listings/${id}`);
//   }

 
  module.exports.destoryListing =  async (req,res)=>{
    let { id } = req.params;
    let deleteli = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}