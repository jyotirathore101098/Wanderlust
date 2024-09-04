const mongoose = require('mongoose');

const Schema=mongoose.Schema;

const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    // image: {
    //     filename: {
    //         type: String,
    //         required: true
    //     },
    //     url: {
    //         type: String,
    //         required: true
    //     }
    // },
    image:{
        type:String,
        default:"https://unsplash.com/photos/person-standing-on-paddle-board-on-body-of-water-DnbKhtkTboo",
        set:(v)=> v===""? "https://unsplash.com/photos/person-standing-on-paddle-board-on-body-of-water-DnbKhtkTboo":v,
    },
    price:Number,
    location:String,
    country:String
});
const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;
