var express = require("express");
var bcrypt = require("bcryptjs");
let alert = require("alert");
var router = express.Router();
var { Customer } = require("../../models/customer");
var { Vendor } = require("../../models/vendor");
var { Book } = require("../../models/book");
var { Rating } = require("../../models/rating");
const { append } = require("express/lib/response");
const { default: mongoose } = require("mongoose");
const res = require("express/lib/response");
const { request } = require("express");
let { session } = require("passport");
const nodemailer = require("nodemailer");

/* ==================================================
|                 EMAIL
=====================================================*/
var transporter = nodemailer.createTransport({
	host: "smtp.mailtrap.io",
	port: 2525,
	auth: {
		user: "79716230bf4e97",
		pass: "debc111eb80f1d",
	},
});

/* ==================================================
|                 REGISTER 
=====================================================*/
router.post("/register", async function (req, res, next) {
	console.log(req.body);
	if (
		!req.body.email ||
		!req.body.name ||
		!req.body.phone ||
		!req.body.address ||
		!req.body.password ||
		!req.body.password2 
	) {
		req.flash("message", "Fill in all detail");
		// res.send(req.flash("message"));
		res.redirect("/customer/signup");
	} else {
		Customer.findOne({ email: req.body.email }).then((customer) => {
			if (customer) {
				req.flash("message", "Email already used");
				// res.send(req.flash("message"));
				res.redirect("/customer/signup");
			} else {
				if (req.body.password != req.body.password2) {
					req.flash("message", "Wrong password");
					// res.send(req.flash("message"));
					res.redirect("/customer/signup");
				} else {
					const data = new Customer({
						name: req.body.name,
						email: req.body.email,
						phone: req.body.phone,
						address: req.body.address,
						password: req.body.password,
						password2: req.body.password2,
					});
					data.save()
						.then(() => {
							req.flash("message", "Account created");
							res.redirect("/customer/login");
						})
						.catch((err) => console.log(err));
				}
			}
		});
	}
});

/* ==================================================
|                 LOGIN 
=====================================================*/
router.post("/login", function (req, res, next) {
	console.log(req.body);
	Customer.findOne({ email: req.body.email }, function (err, data) {
		// console.log(data.email);
		if (data) {
			console.log("1");
			bcrypt
				.compare(req.body.password, data.password)
				.then((doMatch) => {
					if (doMatch) {
						req.session.email = data.email;
						session = req.session.email;
						// console.log("2");
						console.log(session);
						Vendor.find({}, function (err, data) {
							res.render("customer/home", { session, data });
						});
					} else {
						req.flash("message", "Wrong password");
						res.redirect("/customer/login");
					}
				})
				.catch((err) => {
					console.log(err);
				});
		} else {
			req.flash("message", "Email and password not match");
			res.redirect("/customer/login");
		}
	});
});

/* ==================================================
|                 UPDATE PROFILE 
=====================================================*/
router.post("/update/:id", function (req, res, next) {
	var id = req.params.id;
	const update = {
		name: req.body.name,
		email: req.body.email,
		phone: req.body.phone,
		address: req.body.address,
	};
	Customer.findOneAndUpdate({ _id: id }, update)
		.then(() => {
			Customer.find({ _id: id }, function (err, data) {
				if (data) {
					req.flash("message", "Account updated");
					res.redirect("/customer/profile");
				}
			});
		})
		.catch((err) => console.log(err));
});

/* ==================================================
|                 LOCATION 
=====================================================*/
router.post("/location", function (req, res, next) {
	Customer.findOne({ email: session.email }, function (err, data) {
		customer = data;
		const book1 = {
			emailC: session.email,
			date: req.body.date,
			time: req.body.time,
			emailP: req.body.emailP,
		};
	});
});

/* ==================================================
|                 BOOKING
=====================================================*/
router.post("/booking", function (req, res, next) {
	var date1 = JSON.stringify(req.body.date);
	// var i = 0;
	// const data1 = [];

	Customer.findOne({ email: session.email }, function (err, data) {
		if (data) {
			var date2 = JSON.stringify(data.bookDate);
			if (date2 == date1) {
				req.flash("message", "Please choose another date");
				res.redirect("/customer/location");
			} else if (date2 !== date1) {
				message = {
					from: req.session.email,
					to: data.email,
					subject: "You got device to repair",
					text: req.body.problem,
				};
				const book = new Book({
					emailCust: req.body.emailC,
					emailVen: req.body.emailP,
					date: req.body.date,
					time: req.body.time,
					problem: req.body.problem,
					status: "Pending",
				});
				book.save()
					.then(() => {
						transporter.sendMail(message, function (err, info) {
							if (err) {
								console.log(err);
							} else {
								console.log(info);
							}
						});
						req.flash("message", "Booking session successful");
						res.redirect("/customer/history");
					})
					.catch((err) => {
						console.log(err);
						req.flash(
							"message",
							"There is some error while booking"
						);
						res.redirect("/customer/location");
					});
			} else {
				console.log(err);
				req.flash("message", "There is some error while booking");
				res.redirect("/customer/location");
			}
		} else if (!data) {
			message = {
				from: req.session.email,
				to: req.body.emailP,
				subject: "You got device to repair",
				text: req.body.problem,
			};
			const book = new Book({
				emailCust: req.body.emailC,
				date: req.body.date,
				time: req.body.time,
				problem: req.body.problem,
				emailVen: req.body.emailP,
				status: "Pending",
			});
			book.save()
				.then(() => {
					transporter.sendMail(message, function (err, info) {
						if (err) {
							console.log(err);
						} else {
							console.log(info);
						}
					});
					req.flash("message", "Booking session successful");
					res.redirect("/customer/history");
				})
				.catch((err) => {
					console.log(err);
					req.flash("message", "There is some error while booking");
					res.redirect("/customer/location");
				});
		} else {
			console.log(err);
			req.flash("message", "There is some error while booking");
			res.redirect("/customer/location");
		}
	});
});

/* ==================================================
|                 RATING
=====================================================*/
router.post("/like/:id/:email", function (req, res) {
	var email = req.params.email;
	var id = req.params.id;
	Vendor.findOne({email: email}, function(err, data){
		if(data){
			Rating.findOne({idVendor: data._id}, function(err,data1){
				if(data1){
					var oldValue = data1.like;
					var newValue = oldValue + 1;
					const newLike = {
						like: newValue,
					}
					const newStatus = {
						status: "Completed"
					}
					Rating.findOneAndUpdate({idVendor: data._id}, newLike).then(() =>{
						Book.findOneAndUpdate({_id: id}, newStatus).then(() =>{
							res.redirect("/customer/history")
						})
					})
				}
			})
		}
	})
});

router.post("/dislike/:id/:email", function (req, res) {
	var email = req.params.email;
	var id = req.params.id;
	Vendor.findOne({email: email}, function(err, data){
		if(data){
			Rating.findOne({idVendor: data._id}, function(err,data1){
				if(data1){
					var oldValue = data1.dislike;
					var newValue = oldValue + 1;
					const newDislike = {
						dislike: newValue,
					}
					const newStatus = {
						status: "Completed"
					}
					Rating.findOneAndUpdate({idVendor: data._id}, newDislike).then(() =>{
						Book.findOneAndUpdate({_id: id}, newStatus).then(() =>{
							res.redirect("/customer/history")
						})
					})
				}
			})
		}
	})
});

/* ==================================================
|                 LOCATION  FIX
=====================================================*/
router.post("/locationfix", function (req, res, next) {
	Customer.findOne({ email: session.email }, function (err, data) {
		customer = data;
		const book1 = {
			emailC: session.email,
			date: req.body.date,
			time: req.body.time,
			emailP: req.body.emailP,
		};
	});
});


module.exports = router;
