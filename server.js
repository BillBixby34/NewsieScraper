//for Mongoose "Populated" Method

//Dependencies
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
// Requiring our Note and Article models
const Note = require("./models/Note.js");
const Article = require("./models/Article.js");
// Require request and cheerio. This makes the scraping possible
// Our scraping tools
const request = require("request");
const cheerio = require("cheerio");
//set mongoose to leverage built in Javascript
//may take out this line if unable to leverage promises
mongoose.Promise = Promise;
// Initialize Express
const app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));
// Make public a static dir
app.use(express.static("public"));
//Mongoose action below//
//Database configuration here

//Show any mongoose errors here

//Once logged in disply success msg