var express = require("express");
var bcrypt = require("bcryptjs");
let alert = require("alert");
var router = express.Router();
var{Admin} = require("../../models/admin");
const { default : mongoose } = require("mongoose");
const {append} = require("express/lib/response");
const res = require("express/lib/response");
const { request } = require("express");
let {session} = require("passport");



/* ==================================================
|                 REGISTER 
=====================================================*/
router.post("/register", async function (req, res, next) {
	console.log(req.body);
	if (
		!req.body.email ||
		!req.body.name ||
		!req.body.phone ||
		!req.body.password ||
		!req.body.password2
	) {
		alert("message", "Fill in all detail");
	} else {
		Admin.findOne({ email: req.body.email }).then((admin) => {
			if (admin) {
				alert("message", "Email already used");
			} else {
				if (req.body.password != req.body.password2) {
					alert("message", "Wrong password");
				} else {
					const data = new Admin({
						name: req.body.name,
                		email: req.body.email,
              		  	phone: req.body.phone,
                		password: req.body.password,
						password2: req.body.password2,

					});
					data.save()
						.then(() => {
							res.render("admin/loginadmin");
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
	Admin.findOne({ email: req.body.email }, function (err, data) {
		console.log(data.email);
		if (data) {
			console.log("1");
			bcrypt
				.compare(req.body.password, data.password)
				.then((doMatch) => {
					if (doMatch) {
						req.session.email = data.email;
						session = req.session;
						console.log("2");
						console.log(session);
						res.render("admin/homeadmin");
					} else {
						alert("Wrong password input");
					}
				})
				.catch((err) => {
					console.log(err);
				});
		} else {
			alert("Email and Password does not matched");
		}
	});
});   

module.exports = router;
