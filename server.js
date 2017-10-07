//for Mongoose "Populated" Method

//Dependencies
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
// Requiring our Note and Article models
const Note = require("./models/Note.js");
const Article = require("./models/Article.js");
debugger;
console.log("Check for " + Article);
// Require request and cheerio. This makes the scraping possible
// Our scraping tools
const request = require("request");
const cheerio = require("cheerio");
//set mongoose to leverage built in Javascript
//may take out this line if unable to leverage promises
mongoose.Promise = Promise;
// Initialize Express
const app = express();
// trying to resolve missing absolute paths
const url = require("url");
// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));
// Make public a static dir
app.use(express.static("public"));



//Mongoose action below//
//Database configuration here
mongoose.connect("mongodb://localhost/scrapeB");
var db = mongoose.connection;
//Show any mongoose errors here
db.on("error", error => {
	console.log("Mongoose Error: ", error);
});

//Once logged in disply success msg
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

//Routes
//======

// A GET request to scrape the website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  request("http://www.cnn.com/health", function(error, response, html) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    const $ = cheerio.load(html);
    // Now, we grab every h3 with class cd__headline, and do the following:
    $('h3.cd__headline').each(function(i, element) {

      // Save an empty result object
      const result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this).text();
      result.link = url.resolve('http://www.cnn.com/', $(this).children("a").attr("href"));

      // Using our Article model, create a new entry
      // This effectively passes the result object to the entry (and the title and link)
      console.log("checking for " + result);
      const entry = new Article(result);


      // Now, save that entry to the db
      entry.save(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        // Or log the doc
        else {
          console.log("The doc says " + doc);
        }
      });

    });
  });
  // Tell the browser that we finished scraping the text
  res.send("Scrape Complete");
});

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});