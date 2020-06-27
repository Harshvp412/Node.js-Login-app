const mongoose = require('mongoose');
const userURL = require('../config/keys').MongoURI;

const mongOptions = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose.connect(userURL, mongOptions);
mongoose.set('useFindAndModify', false);

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const noteSchema = new mongoose.Schema({
  notesID: String,
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  }
});


const Users = mongoose.model("users", UserSchema);
const Notes = mongoose.model("notes", noteSchema);

module.exports = [Users, Notes];
