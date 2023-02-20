var mongoose = require("mongoose");

var file = new mongoose.Schema({
    vendorEmail:{type: String, required:true},
    image:
    {
        data: Buffer,
        contentType: String
    }
});


const File= mongoose.model("file", file);
module.exports = {File};