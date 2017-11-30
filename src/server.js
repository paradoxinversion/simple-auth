const path = require("path");
const express = require('express');
const session = require("express-session");
const bodyParser = require('body-parser');
const passport = require("passport");
const logger = require("morgan");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./controllers/db.js");


const app = express();

const index = require("./routes/index.js");

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.set('view engine', 'pug');
app.set('views', path.join(__dirname,'/views'));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session(
  {
    secret: "authentication",
    resave: "true",
    saveUninitialized: "false"
  }
));
passport.use(new LocalStrategy(
  function(username, password, done){
    return User.getUserByName(username)
      .then(user => {
        if (!user){
          return done(null, false);
        }
        return User.checkPassword(user, password)
          .then(isGoodPassword => {
            if (!isGoodPassword){
              return done(null, false);
            }
            return done(null, user);
          })
          .catch(error => {
            console.log(error);
          });
      })
      .catch(error => {
        console.log(error);
      });
  }
));

passport.serializeUser(function(user, done){
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  User.getUserById(id)
    .then(user => {
      done(err, user);
    })
    .catch(error => {
      console.log(error);
    });
});

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