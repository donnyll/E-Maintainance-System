var express = require("express");
var bcrypt = require("bcryptjs");
let alert = require("alert");
var router = express.Router();
var { Vendor } = require("../../models/vendor");
const { append } = require("express/lib/response");
const { default: mongoose } = require("mongoose");
const res = require("express/lib/response");
const { request } = require("express");
let { session } = require("passport");
const { Customer } = require("../../models/customer");
const { Book } = require("../../models/book");
const { Rating } = require("../../models/rating");
const nodemailer = require("nodemailer");

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
		!req.body.companyname ||
		!req.body.phone ||
		!req.body.ssm ||
		!req.body.password ||
		!req.body.password2 ||
		!req.body.address ||
		!req.body.lat ||
		!req.body.long
	) {
		req.flash("message", "Fill in all detail");
		res.send(req.flash("message"));
	} else {
		Vendor.findOne({ email: req.body.email }).then((vendor) => {
			if (vendor) {
				req.flash("message", "Email already used");
				res.send(req.flash("message"));
			} else {
				if (req.body.password != req.body.password2) {
					req.flash("message", "Wrong password");
					res.send(req.flash("message"));
				} else {
					const data = new Vendor({
						companyname: req.body.companyname,
						email: req.body.email,
						phone: req.body.phone,
						ssm: req.body.ssm,
						password: req.body.password,
						password2: req.body.password2,
						address: req.body.address,
						lat: req.body.lat,
						long: req.body.long,
					});
					data.save()
						.then(() => {
							const newRating = new Rating({
								idVendor: data._id,
								like: 0,
								dislike: 0,
							})
							newRating.save().then(() =>{
								res.render("vendor/loginvendor");
							}).catch((err) => console.log(err))
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
	
	Vendor.findOne({ email: req.body.email }, function (err, data) {
	
		if (data) {
			console.log("1");
			bcrypt
				.compare(req.body.password, data.password)
				.then((doMatch) => {
					if (doMatch) {
						req.session.email = data.email;
						session = req.session.email;
						console.log("2");
						console.log(session);
						res.render("vendor/homevendor", {
							companyname: data.companyname,
							email: data.email,
							phone: data.phone,
							ssm: data.ssm,
							address: data.address,
							lat: data.lat,
							long: data.long,
						});
					} else {
						req.flash("message", "Wrong password");
					}
				})
				.catch((err) => {
					console.log(err);
				});
		} else {
			req.flash("message","Email and Password does not matched");
		}
	});
});

router.post("/update/:id", function (req, res) {
	var id = req.params.id;
	var update = {
		companyname: req.body.companyname,
		email: req.body.email,
		phone: req.body.phone,
		ssm: req.body.ssm,
		lat: req.body.lat,
		long: req.body.long,
	};
	Vendor.findOneAndUpdate({ _id: id }, update)
		.then(() => {
			Vendor.findOne({ _id: id }, function (err, data) {
				if (data) {
					req.flash("Update Success");
					res.redirect("/vendor/profilevendor");
				}
			});
		})
		.catch((err) => {
			console.log(err);
		});
});

/* ==================================================
|                 FILE UPLOAD
=====================================================*/
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { File } = require("../../models/File");
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads");
	},
	filename: function (req, file, cb) {
		cb(
			null,
			file.fieldname + "-" + Date.now() + path.extname(file.originalname)
		);
	},
});
const upload = multer({ storage: storage });

router.post("/upload", upload.single("myImage"), (req, res) => {
	const obj = {
		vendorEmail: req.body.vendorEmail,
		img: {
			data: fs.readFileSync(
				path.join(__dirname, "..", "..", "uploads", req.file.filename)
			),
			contentType: "image/png",
		},
	};

	const newImage = new File({
		vendorEmail: obj.vendorEmail,
		image: obj.img,
	});
	newImage.save((err) => {
		err ? console.log(err) : res.redirect("/vendor/display");
	});
});

/* ==================================================
|                 HISTORY
=====================================================*/
router.post("/comment/:id", function (req, res) {
	var id = req.params.id;
	var update = {
		comment: req.body.comment,
		status: "Accepted",
	};
	Book.findOneAndUpdate({ _id: id }, update).then(() => {
		Book.findOne({ _id: id }, function (err, data) {
			message = {
				from: data.emailVen,
				to: data.emailCust,
				subject: "Vendor Job Accepted",
				text: data.problem + " " + data.emailVen,
				html: `<h1>Accepted Job</h1><br><p>Comment: ${data.comment}</p>`,
			};
			if (data) {
				transporter.sendMail(message, function (err, info) {
					if (err) {
						console.log(err);
					} else {
						console.log(info);
					}
				});
				res.redirect("/vendor/history");
			}
		});
	});
});

module.exports = router;
