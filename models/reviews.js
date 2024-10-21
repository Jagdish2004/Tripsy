const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let reviewSchema = new Schema({
    comment: {
        type: String,
        require: true,
    },
    rangeInput:{
        type:Number,
        max: 5,
        min: 1,
        required: true,
    },
    createdAt:{
        type:Date,
        default : Date.now(),
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
     }

});



const reviews = mongoose.model("reviews",reviewSchema);
module.exports = reviews;
