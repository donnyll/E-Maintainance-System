var bycrypt = require("bcryptjs");
var mongoose = require("mongoose");


const SALT_FACTOR = 10;

var admin = new mongoose.Schema({
    email:{type: String, required:true},
    name:{type: String, required: true},
    phone:{type: String, required: true},
    password:{type: String, required: true},
    password2:{type: String, required: true},
});

admin.pre("save", function (done) {
	var admins = this;
	if (!admins.isModified("password")) {
		return done();
	}
	bycrypt.genSalt(SALT_FACTOR, function (err, salt) {
		if (err) {
			return done(err);
		}
		bycrypt.hash(admins.password, salt, function (err, hashedPassword) {
			if (err) {
				return done(err);
			}
			admin.password = hashedPassword;
			done();
		});
	});
});

admin.methods.checkPassword = function (guess, done) {
	if (this.password != null) {
		bycrypt.compare(guess, this.password, function (err, isMatch) {
			done(err, isMatch);
		});
	}
};admin.pre("save", function (done) {
	var admins = this;
	if (!admins.isModified("password")) {
		return done();
	}
	bycrypt.genSalt(SALT_FACTOR, function (err, salt) {
		if (err) {
			return done(err);
		}
		bycrypt.hash(admins.password, salt, function (err, hashedPassword) {
			if (err) {
				return done(err);
			}
			admins.password = hashedPassword;
			done();
		});
	});
});

admin.methods.checkPassword = function (guess, done) {
	if (this.password != null) {
		bycrypt.compare(guess, this.password, function (err, isMatch) {
			done(err, isMatch);
		});
	}
};

const Admin= mongoose.model("admin", admin);
module.exports = {Admin};