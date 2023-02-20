var express = require("express");
var passport = require("passport");
var router = express.Router();

/* ==================================================
|                WELCOME PAGE 
=====================================================*/
router.get("/", function (req, res) {
	res.render("home");
});

/* ==================================================
|                 CUSTOMER 
=====================================================*/
router.use("/customer", require("./customer"));

/* ==================================================
|                 VENDOR 
=====================================================*/
router.use("/vendor", require("./vendor"));

/* ==================================================
|                 ADMIN 
=====================================================*/
router.use("/admin", require("./admin"));

module.exports = router;
