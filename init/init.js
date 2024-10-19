const mongoose = require('mongoose');
const initData = require('./data');
const Listing = require("../models/listing");

main().then(()=>{
    console.log("connected to mongoDB");
}).catch(err => console.log(err));

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/Tripsy');
}

const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({
        ...obj,
        owner: "670d1ffa0d8af95028437ba9",
    }));
    await Listing.insertMany(initData.data);
}

initDB();
