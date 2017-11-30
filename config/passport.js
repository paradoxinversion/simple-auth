const LocalStrategy = require("passport-local").Strategy;
const User = require("../src/controllers/db.js");
// const passport = require("passport");

// User Serialization

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

//Authentication Strategies
passport.use('local-signup',new LocalStrategy(
  function(username, password, done){
    console.log("signup strategy")
    return User.addUser(username, password)
      .then(user => {
        if (user){
          return done(null, user);
        }
      })
      .catch(error => {
        console.log(error);
        done(error);
      });
  }
));

passport.use('local-login',new LocalStrategy(
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
