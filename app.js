//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();
const uri = "mongodb+srv://kafaister:D8FXnwESw5GSl8Ry@cluster0.ct0ukwa.mongodb.net/?retryWrites=true&w=majority"

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

async function connect() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
}

connect();

const userSchema = new mongoose.Schema ({ //object created from mongoose schema class
  email: String,
  password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] }); //add encrypt package as a plugin

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save(function(err){
    if (!err){
      res.render("secrets"); //only renders if registered successfully
    } else {
      console.log(err);
    }
  });
});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser){
    if (!err){
      if (foundUser) {
        if(foundUser.password === password) {
          res.render("secrets");
        } else {
          console.log(err);
        }
      }
    }
  })
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
