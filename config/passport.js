const LocalStrategy = require("passport-local").Strategy;
const User = require("../src/controllers/db.js");
// const passport = require("passport");


module.exports = function(passport){

  /*
    These functions handle serializing and deserializing the user
  */

  passport.serializeUser(function(user, done){
    done(null, user.id);
  });


  passport.deserializeUser(function(id, done){
    User.getUserById(id)
      .then(user => {
        done(null, user);
      })
      .catch(error => {
        done(error, false);
      });
  });

  /*
    Here we configure two different local strategies for passport--
    One handles signing up, one handles signing in.
  */
  
  passport.use('local-signup',new LocalStrategy(
    function(username, password, done){
      return User.addUser(username, password)
        .then(user => {
          if (user){
            return done(null, user);
          }
        })
        .catch(error => {
          done(error, false);
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
              done(error, false);
            });
        })
        .catch(error => {
          done(error, false);
        });
    }
  ));

};
