const express= require('express');
const layouts= require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport= require('passport');


const app = express();

//Configure Passport
require('./config/passport')(passport);

//EJS
app.use(layouts);
app.set('view engine', 'ejs');

// Body parser
app.use(express.urlencoded( {extended: false} ));

//Express sessions 
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Intialiaze flash
app.use(flash());

//Introducing Globle variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


//Routes
app.use('/',require('./routes/index.js'));
app.use('/users',require('./routes/users.js'));


const PORT= process.env.PORT || 3000

app.listen(PORT,console.log(` Listerning to PORT ${PORT}`));