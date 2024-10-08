const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ListingSchema = new Schema({
    title:{
        type: String,
        require: true,
    },
    image:{
       filename: String,
       url:{
        type: String,
        default: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
         }
       
    },
    price:{
        type: Number,
        required: true,
    },
    description:{
        type: String,
    },
    location:{
        type:String,
    },
    country:{
        type:String,
    },
    reviews: [
        {
        type: Schema.Types.ObjectId,
        ref: "reviews",
        }
]

});

const Listing = mongoose.model("Listing",ListingSchema);
module.exports = Listing;