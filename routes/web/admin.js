var express = require("express");
var bcrypt = require("bcryptjs");
var flash = require("connect-flash");
var router = express.Router();


/* ==================================================
|                 LOGIN
=====================================================*/
router.get("/loginadmin", function(req, res){
    res.render("admin/loginadmin");

});

/* ==================================================
|                 SIGNUP
=====================================================*/
router.get("/signupadmin", function(req, res){
    res.render("admin/signupadmin");

});

/* ==================================================
|                   HOME
=====================================================*/
router.get("/homeadmin", function(req, res){
    res.render("admin/homeadmin");

});

module.exports = router;