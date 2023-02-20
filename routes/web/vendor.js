var express = require("express");
var bcrypt = require("bcryptjs");
var flash = require("connect-flash");
var router = express.Router();
var { Vendor } = require("../../models/vendor");
let { session } = require("passport");
const { Customer } = require("../../models/customer");
const { Book } = require("../../models/book");

/* ==================================================
|                 LOGIN 
=====================================================*/
router.get("/loginvendor", function (req, res) {
	res.render("vendor/loginvendor");
});

/* ==================================================
|                 SIGNUP 
=====================================================*/
router.get("/signupvendor", function (req, res) {
	res.render("vendor/signupvendor");
});

/* ==================================================
|                 HOME 
=====================================================*/
// router.get("/homevendor", function(req, res){
//     res.render("vendor/homevendor");

// });

router.get("/homevendor", function (req, res) {
	Vendor.find({}, function (err, data) {
		if (data) {
			res.render("vendor/homevendor", { vendors: data });
		}
	});
});

/* ==================================================
|                 PROFILE 
=====================================================*/
router.get("/profilevendor", function (req, res, next) {
	Vendor.findOne({ email: req.session.email }, function (err, data) {
		if (data) {
			res.render("vendor/profilevendor", {
				id: data._id,
				companyname: data.companyname,
				email: data.email,
				phone: data.phone,
				ssm: data.ssm,
				address: data.address,
				lat: data.lat,
				long: data.long,
			});
		} else {
			res.render("vendor/homevendor");
		}
	});
});

/* ==================================================
|                 UPDATE PROFILE 
=====================================================*/
router.get("/editvendor", function (req, res, next) {
	Vendor.findOne({ email: req.session.email }, function (err, data) {
		if (data) {
			res.render("vendor/editvendor", {
				id: data._id,
				companyname: data.companyname,
				email: data.email,
				phone: data.phone,
				ssm: data.ssm,
				address: data.address,
				lat: data.lat,
				long: data.long,
			});
		} else {
			res.render("vendor/homevendor");
		}
	});
});

/* ==================================================
|                 FILE UPLOAD
=====================================================*/
router.get("/upload", function (req, res) {
	res.render("vendor/upload", { email: req.session.email });
});

const { File } = require("../../models/File");
router.get("/display", function (req, res) {
	File.find({ vendorEmail: req.session.email }, (err, images) => {
		if (err) {
			console.log(err);
			res.status(500).send("An error occurred", err);
		} else {
			res.render("vendor/display", { images: images });
		}
	});
});

/* ==================================================
|                 HISTORY
=====================================================*/
router.get("/history", function (req, res) {
	var bookings = [];
	Book.find({ emailVen: req.session.email }, function (err, data) {
		if (!data) {
			console.log("not found");
		} else {
			Customer.find({}, function (err, data1) {
				for (let bookinfo of data) {
					for (let dataCustomer of data1) {
						if (dataCustomer.email === bookinfo.emailCust) {
							let booking = bookinfo;
							booking.address = dataCustomer.address;
							booking.custName = dataCustomer.name;
							booking.email = dataCustomer.email;
							booking.phone = dataCustomer.phone;
							bookings.push(booking);
						}
					}
				}
				console.log(bookings);
				res.render("vendor/history", { bookings });
			});
		}
	});
});

/* ==================================================
|                 ACCEPT JOB
=====================================================*/
router.get("/accept/:id", function (req, res) {
	var id = req.params.id;
	Book.findOne({ _id: id }, function (err, data) {
		if (data) {
			res.render("vendor/comment", { data });
		} else {
			res.redirect("/vendor/homevendor");
		}
	});
});

/* ==================================================
|                 ACCEPT JOB
=====================================================*/
router.get("/reject/:id", function (req, res) {
	var id = req.params.id;
	Book.findOneAndRemove({ _id: id }, function (err, data) {
		if (data) {
			res.
			req.flash("message", "Remove succesfully");
			res.redirect("/vendor/history");
		}
	});
});
module.exports = router;
