var bycrypt = require("bcryptjs");
var mongoose = require("mongoose");


const SALT_FACTOR = 10;

var vendor = new mongoose.Schema({
    email:{type: String, required:true},
    companyname:{type: String, required: true},
    phone:{type: String, required: true},
	ssm:{type: String, required: true},
    password:{type: String, required: true},
	address:{type: String, required: true},
	lat:{type: String, required: true},
	long:{type: String, required: true},
});

vendor.pre("save", function (done) {
	var vendors = this;
	if (!vendors.isModified("password")) {
		return done();
	}
	bycrypt.genSalt(SALT_FACTOR, function (err, salt) {
		if (err) {
			return done(err);
		}
		bycrypt.hash(vendors.password, salt, function (err, hashedPassword) {
			if (err) {
				return done(err);
			}
			vendor.password = hashedPassword;
			done();
		});
	});
});

vendor.methods.checkPassword = function (guess, done) {
	if (this.password != null) {
		bycrypt.compare(guess, this.password, function (err, isMatch) {
			done(err, isMatch);
		});
	}
};vendor.pre("save", function (done) {
	var vendors = this;
	if (!vendors.isModified("password")) {
		return done();
	}
	bycrypt.genSalt(SALT_FACTOR, function (err, salt) {
		if (err) {
			return done(err);
		}
		bycrypt.hash(vendors.password, salt, function (err, hashedPassword) {
			if (err) {
				return done(err);
			}
			vendors.password = hashedPassword;
			done();
		});
	});
});

vendor.methods.checkPassword = function (guess, done) {
	if (this.password != null) {
		bycrypt.compare(guess, this.password, function (err, isMatch) {
			done(err, isMatch);
		});
	}
};

const Vendor= mongoose.model("vendor", vendor);
module.exports = {Vendor};