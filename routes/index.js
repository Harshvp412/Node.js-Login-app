const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const mongoose = require('mongoose');

//Configure database
const [Users ,Notes] = require("../models/User");

// Welcome Page
router.get('/',  (req, res) => res.render('welcome'));


router.get('/dashboard/add',ensureAuthenticated,(req, res) => {
    res.render('addnotes' )    
});

// Notes Handler
router.post('/dashboard/add', (req, res) =>{
    const notesID = req.user.id;
    const { title, text} = req.body;
  const newNote = new Notes({
      notesID,
      title,
      text
  });
   newNote.save()
  console.log(title,text);
  res.redirect('/dashboard');
});

// Getting added items
router.get('/dashboard', ensureAuthenticated, (req, res)=>{
   Notes.find((err, items)=>{
       if(err){
           console.log(err)
       }else{
           res.render('dashboard', {items: items ,name: req.user.name , userID : req.user._id});
       }
   }) 
});

// Editing Note
router.get('/dashboard/edit/:id', (req,res) =>{

    Notes.findById( req.params.id,(err, items)=>{
        console.log(items);
        if(err){
            console.log(err)
        }else{
            res.render('editNotes', {items: items });
        }
    });
});
router.post('/dashboard/edit/:id',(req, res) =>{
    const updatedData= {
        title : req.body.title,
        text : req.body.text
    }
    Notes.findByIdAndUpdate(req.params.id,updatedData, (err)=>{
        if(err){
            console.log(err);
        }else{
            res.redirect('/dashboard');
        }
    });
});

// Deleting Note
router.get('/delete/:id', (req , res)=>{
    Notes.findByIdAndDelete( req.params.id, (err, data) =>{
        if(err){
            res.redirect('../dashboard');
        }else{
            res.redirect('../dashboard');
            console.log('Note deleted');
        }
    });
});

module.exports = router;

