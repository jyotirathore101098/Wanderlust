const mongoose = require('mongoose');
const initData=require("./data.js");
const Listing=require("../models/listing.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("connec to DB");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    mongoose.connect(MONGO_URL);
    
}
const initDB=async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({
        ...obj,
        owner:"68358b8d962adf0f6d5c7010",
    }));
    await Listing.insertMany(initData.data);
    console.log("data was initiliased");
}
initDB();