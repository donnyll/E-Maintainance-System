var bycrypt = require("bcryptjs");
var mongoose = require("mongoose");


const SALT_FACTOR = 10;

var book = new mongoose.Schema({
    emailCust:{type: String, required:true},
    emailVen:{type: String, required:true},
    date:{type: String, required:true},
    time:{type: String, required:true},
    problem:{type: String, required:true},
    comment: { type: String, required: false},
    status:{type: String, required:true},
}); 

const Book = mongoose.model("booking", book);
module.exports = { Book };