const path = require("path");
const express = require('express');
const session = require("express-session");
const bodyParser = require('body-parser');
const passport = require("passport");
const logger = require("morgan");
const index = require("./routes/index.js");

const app = express();

/*
  Here we linked to our passport config file. It has our serialze/deserialize
  functions as well as our sign-up and log-in strategies
*/
require("../config/passport.js")(passport);


app.set('view engine', 'pug');
app.set('views', path.join(__dirname,'/views'));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

/*
  express-session is used to persist our authentication throughout our session
  This lasts only until the server is restarted (check this for truth)
*/
app.use(session(
  {
    secret: "authentication",
    resave: "true",
    saveUninitialized: "false"
  }
));

/*
  Initialize Passport for use
*/
app.use(passport.initialize());
app.use(passport.session());

app.use("/", index);

app.use(function(req, res, next){
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next){
  res.status(err.status || 500);
  res.send(err.status);
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));
