const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema}=require("./schema.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("connec to DB");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);

    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }

}

// Index routing
app.get("/listings",wrapAsync(async(req,res)=>{
   const allListings=await Listing.find({});
   console.log(allListings);
   res.render("listings/index.ejs",{allListings});
}));
// new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});

// show route
app.get("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
}));
// create route
app.post("/listings",validateListing,wrapAsync(async (req,res,next)=>{
   
    // let{title, description, image, price, location, country}=req.body;
    const newListing=new Listing(req.body.listing);
    
        await newListing.save();
        res.redirect("/listings");   
}));
// edit route
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
    
}));
// update route
app.put("/listings/:id",validateListing,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));
// delete route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));




// app.get("/testlisting",async(req,res)=>{
//     let sampleList=new Listing({
//         title:"sea",
//         description:"bt the beach",
//         price:0,
//         location:"goa",
//         country:"India"
//     })
//     await sampleList.save();
//     console.log("sample saved");
//     res.send("sucessfull");
// })

app.get("/",(req,res)=>{
    res.send("HI, I m root");
});

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found!"));
});  

app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
});

app.listen("8080",()=>{
    console.log("app is listening on port 8080");
});