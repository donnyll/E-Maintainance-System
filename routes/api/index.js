var express = require("express");
var { Customer } = require("../../models/customer");
const { default: mongoose } = require("mongoose");
var router = express.Router();


router.use("/customer", require("./customer"));
router.use("/vendor", require("./vendor"));
router.use("/admin", require("./admin"));


/* ==================================================
|               LOGOUT ALL USERS 
=====================================================*/
router.get("/logout", function (req,res,next){
    console.log("logout");
    if (req.session) {
        req.session.destroy(function(err){
            if(err){
                return next(err);
            }else{
                return res.redirect("/");
            }
        });
    }
});

module.exports = router;
