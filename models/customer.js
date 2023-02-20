var bycrypt = require("bcryptjs");
var mongoose = require("mongoose");


const SALT_FACTOR = 10;

var customer = new mongoose.Schema({
    email:{type: String, required:true},
    name:{type: String, required: true},
    // username:{type: String, required: true},
    phone:{type: String, required: true},
	address:{type: String, required: true},
    password:{type: String, required: true},
    password2:{type: String, required: true},
});

customer.pre("save", function (done) {
	var customers = this;
	if (!customers.isModified("password")) {
		return done();
	}
	bycrypt.genSalt(SALT_FACTOR, function (err, salt) {
		if (err) {
			return done(err);
		}
		bycrypt.hash(customers.password, salt, function (err, hashedPassword) {
			if (err) {
				return done(err);
			}
			customer.password = hashedPassword;
			done();
		});
	});
});

customer.methods.checkPassword = function (guess, done) {
	if (this.password != null) {
		bycrypt.compare(guess, this.password, function (err, isMatch) {
			done(err, isMatch);
		});
	}
};customer.pre("save", function (done) {
	var customers = this;
	if (!customers.isModified("password")) {
		return done();
	}
	bycrypt.genSalt(SALT_FACTOR, function (err, salt) {
		if (err) {
			return done(err);
		}
		bycrypt.hash(customers.password, salt, function (err, hashedPassword) {
			if (err) {
				return done(err);
			}
			customers.password = hashedPassword;
			done();
		});
	});
});

customer.methods.checkPassword = function (guess, done) {
	if (this.password != null) {
		bycrypt.compare(guess, this.password, function (err, isMatch) {
			done(err, isMatch);
		});
	}
};

const Customer= mongoose.model("customer", customer);
module.exports = {Customer};