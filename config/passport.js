const LocalStrategy = require('passport-local').Strategy;
const mongoose= require('mongoose');
const bcrypt = require('bcryptjs');

// Load User model
const [Users ,Notes] = require("../models/User");

module.exports = function(passport){
  passport.use(
    new LocalStrategy ({usernameField : 'email'},(email, password, done)=>{
      // Match User
      Users.findOne({email : email })
       .then(user => {
         if( !user){
           return done( null, false,{ message:'Email is not registered'});
         }
         //Match password
         bcrypt.compare( password, user.password, (err, isMatch) =>{
           if (err) throw err;
           if(isMatch){
             return done(null, user);
           }else{
             return done(null , false, {message: "Password doesn't exist "});
           }
         });
       })
       .catch ( err => console.log('err'));
    })
  );
  passport.serializeUser((user, done)=> {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) =>{
    Users.findById(id, (err, user) => {
      done(err, user);
    });
  });
}
