//for Mongoose "Populated" Method

//Dependencies
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
// Requiring our Note and Article models
const Note = require("./models/Note.js");
const Article = require("./models/Article.js");
//debugger;
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
//Scrape Article Routes

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
// This will get the articles we scraped from the mongoDB
app.get("/articles", function(req, res) {
  // Grab every doc in the Articles array
  Article.find({}, function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});
// Find all articles marked as saved
app.get("/saved", function(req, res) {
  // Go into the mongo collection, and find all docs where "saved" is true
  db.articles.find({ "saved": true }, function(error, found) {
    // Show any errors
    if (error) {
      console.log(error);
    }
    // Otherwise, send the articles we found to the browser as a json
    else {
      res.json(found);
    }
  });
});
// Grab an article by it's ObjectId
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  Article.findOne({ "_id": req.params.id })
  // ..and populate all of the notes associated with it
  .populate("note")
  // now, execute our query
  .exec(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise, send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});
//Note Routes
// Create a new note or replace an existing note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  var newNote = new Note(req.body);

  // And save the new note in the db
  newNote.save()
  .catch(error => res.send(error))
  .then(doc =>{
      //catch error, then
      // Use the article id to find and update it's note
      Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
      // Execute the above query
      .exec(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        else {
          // Or send the document to the browser
          res.send(doc);
        }
      });
    });
});
/* OUR CUSTOM METHODS
 * (methods created in the userModel.js)
 * -/-/-/-/-/-/-/-/-/ */




// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});