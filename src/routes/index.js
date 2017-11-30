const passport = require("passport");
const express = require("express");
const router = express.Router();

const isLoggedIn = function isLoggedIn(req, res, next){
  if (req.isAuthenticated()){
    return next();
  }
  
  res.redirect('/');
};

router.get("/", function(req, res){
  res.render("index");
});

router.get("/sign-up", function(req, res){
  res.render("sign-up");
});

router.post("/sign-up", passport.authenticate('local-signup',{
  successRedirect: "/authenticated",
  failureRedirect: "/sign-up"
}));

router.get("/log-in", function(req, res){
  res.render("log-in");
});
router.post("/log-in", passport.authenticate("local-login", {
  successRedirect: "/authenticated",
  failureRedirect: "/log-in"
}));
router.get("/log-out", function(req, res){
  req.logout();
  res.redirect("/");
});

router.get("/authenticated", isLoggedIn, function(req, res){
  res.render("authenticated-area", {user: req.session.passport.user});
});
module.exports = router;
