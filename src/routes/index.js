const passport = require("passport");
const express = require("express");
const User = require("../controllers/db");
const router = express.Router();

router.get("/", function(req, res){
  res.render("index");
});

router.get("/sign-up", function(req, res){
  res.render("sign-up");
});

router.post("/sign-up", function(req, res){
  User.addUser(req.body.username, req.body.password)
    .then(newUser =>{
      res.redirect("/authenticated");
    })
  res.render("sign-up");
});

router.get("/log-in", function(req, res){
  res.render("log-in");
});
router.post("/log-in", passport.authenticate("local"), function(req, res){
  res.render("log-in");
});
router.get("/log-out", function(req, res){
  req.logout();
  res.redirect("/");
});

router.get("/authenticated", passport.authenticate("local"), function(req, res){
  res.render("authenticated-area");
});
module.exports = router;
