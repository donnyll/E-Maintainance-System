var bycrypt = require("bcryptjs");
var mongoose = require("mongoose");

var rating = new mongoose.Schema({
    idVendor: { type: String, required: true },
    like: { type: Number, required: true },
    dislike: { type: Number, required: true },
}); 

const Rating = mongoose.model("rating", rating);
module.exports = { Rating };