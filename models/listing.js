const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ListingSchema = new Schema({
    title:{
        type: String,
        require: true,
    },
    image:{
       filename: String,
       url: String,
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
     ],
     owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
     }

});

const Listing = mongoose.model("Listing",ListingSchema);
module.exports = Listing;