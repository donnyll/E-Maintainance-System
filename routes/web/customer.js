var express = require("express");
var bcrypt = require("bcryptjs");
var flash = require("connect-flash");
const url = require("url");
var router = express.Router();
var { Customer } = require("../../models/customer");
const { Vendor } = require("../../models/vendor");
const { Book } = require("../../models/book");
const { Rating } = require("../../models/rating");
let { session } = require("passport");

/* ==================================================
|                 LOGIN 
=====================================================*/
router.get("/login", function (req, res) {
	res.render("customer/login");
});

/* ==================================================
|                 SIGNUP 
=====================================================*/
router.get("/signup", function (req, res) {
	res.render("customer/signup");
});

/* ==================================================
|                 HOME
=====================================================*/
router.get("/home", function (req, res) {
	let vendor_name = req.query.vendor_name;
	let queries = {};
	if(typeof vendor_name == "string" && vendor_name.length > 0){
		queries ["companyname"] = vendor_name;
	}
	Vendor.find(queries, function (err, data) {
		console.log(data)
		if (data) {
			res.render("customer/home", { data });
		}
	});
});

/* ==================================================
|                 PROFILE 
=====================================================*/
router.get("/profile", function (req, res, next) {
	Customer.findOne({ email: req.session.email }, function (err, data) {
		if (data) {
			res.render("customer/profile", {
				name: data.name,
				email: data.email,
				address: data.address,
				phone: data.phone,
			});
		} else {
			res.redirect("/customer/home");
		}
	});
});

/* ==================================================
|                 UPDATE PROFILE 
=====================================================*/
router.get("/update", function (req, res) {
	Customer.findOne({ email: req.session.email }, function (err, data) {
		if (data) {
			res.render("customer/update", { data });
		} else {
			res.render("customer/home");
		}
	});
});

/* ==================================================
|                 LOCATION 
=====================================================*/
router.get("/location", function (req, res) {
	Vendor.find({}, function (err, data) {
		if (data) {
			console.log("success");
			res.render("customer/location", { data });
		} else {
			console.log("unsuccess");
			res.render("customer/home");
		}
	});
});

/* ==================================================
|                 BOOKING
=====================================================*/
router.get("/book/:email", function (req, res) {
	console.log(req.session.email);
	Customer.findOne({ email: req.session.email }, function (err, data) {
		console.log(data);
		if (data) {
			Vendor.findOne({ email: req.params.email }, function (err, data1) {
				console.log(data1);
				if (data1) {
					res.render("customer/book", { data, data1 });
				} else {
					res.redirect("/customer/location");
				}
			});
		} else {
			console.log(err);
			res.redirect("/customer/home");
		}
	});
});


/* ==================================================
|                 CUSTOMER BOOKING
=====================================================*/
router.get("/cbook/:id", function (req, res) {
	var id = req.params.id
	Vendor.find({ _id: id }, function (err, data) {
		if (data) {
			Rating.findOne({idVendor: id}, function(err,data1){
				res.render("customer/cbook", { data, data1});
			})
		} else {
			res.redirect("/customer/home");
		}
	});
});

/* ==================================================
|                 HISTORY
=====================================================*/
router.get("/history", function (req, res) {
	Book.find({ emailCust: req.session.email }, function (err, data) {
		if (data) {
			res.render("customer/history", { data });
		} else {
			alert("There is no history to be display");
			res.render("customer/history");
		}
	});
});

/* ==================================================
|                 RATING
=====================================================*/
router.get("/rate/:id", function (req, res) {
	var id = req.params.id;
	Book.findOne({ _id: id }, function (err, data) {
		res.render("customer/rate", { data });
	});
});

/* ==================================================
|                 FILE UPLOAD
=====================================================*/

const { File } = require("../../models/File");
router.get("/display/:email", function (req, res) {
	var email = req.params.email;
	console.log("3",email);
	File.findOne({vendorEmail: email}, function (err, images) {
		if (err){
			console.log(err)
		}
		if(images){
			console.log("1");
			res.render("customer/display", { images: images });
		}	
		 else {
			Vendor.findOne({email: email}, function(err1 ,data){
				if(data){
					res.redirect(`/customer/cbook/${data._id}`)
				}
				else{
					console.log("2");
				}
			})
			// res.status(504).send("An error occurred", err);
		}
	});
});

/* ==================================================
|                 LOCATION FIX 
=====================================================*/
router.get("/locationfix/:id", function (req, res) {
	var id = req.params.id
	Vendor.find({_id: id}, function (err, data) {
		if (data) {
			console.log("success");
			res.render("customer/locationfix", { data });
		} else {
			
			res.render("customer/home");
		}
	});
});

module.exports = router;
