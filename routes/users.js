const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// User models
const [Users , Notes ]= require('../models/User');
const passport = require('passport');
const { route } = require('.');

// Login Page
router.get('/login', (req, res) => res.render('login'));

// Register Page
router.get('/register',(req, res) => res.render('register'));

// Register handler
router.post('/register' , (req , res) =>{
    const { name, email , password , password2} = req.body;
    let errors= [];
    //check field
    if(!name || !email || !password || !password2){
        errors.push({msg:'Fill all the fields'});      
    };
      //check password match
      if( password !== password2){
        errors.push({msg:'Password do not match'});      
    };
      //check password length
      if( password.length <6){
        errors.push({msg:'Password length should be atleast 6 characters'});      
    };
    if(errors.length >0){
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    }else{
        //Validation passed 
        Users.findOne({email : email})
         .then( user =>{
             if(user){
                //User exists
                errors.push({msg: 'Email already exists'})
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                }); 
             }else{
                 const newUser = new Users({
                     name,
                     email,
                     password
                 });
                 // hashed password
                 bcrypt.genSalt(10, (err, salt)=> 
                  bcrypt.hash(newUser.password , salt , (err, hash)=>{
                        if(err) throw err;
                        // Setting hashed password
                        newUser.password = hash;
                        // saving the user
                        newUser.save()
                         .then( user =>{
                             req.flash('success_msg', 'You are now registered');
                             res.redirect('/users/login');
                         }) 
                         .catch(err => console.log(err)) 

                 }))
             }
         });
    }
});

// Login handler
router.post('/login', (req, res, next) =>{
    passport.authenticate('local',{
        successRedirect:'/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

//LogOut handler
router.get('/logout', (req , res) =>{
    req.logOut();
    req.flash('success_msg', 'You are successfully logOut');
    res.redirect('/users/login');

})

module.exports = router;
