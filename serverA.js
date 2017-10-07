//Dependencies
const express = require("express");
const mongojs = require("mongojs");
//require cheerios to parse html and find elements
const cheerio = require('cheerio');
//makes http request for html page
const request = require('request');
//Initialize Express
const app = express();

//Database configurations
const databaseUrl = "scrapeA";
//Name the collection
const collections = ["ScrapedDataA"]
// trying to resolve missing absolute paths
const url = require("url");
//Hook mogojs configuration to the db variable
const db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
	console.log("Database Error:", error);
});

/////Routes/////////

//Main route (test with "hello world");
app.get("/", function(req, res) {
	res.send("Hello world");
});

//Find All data from db r
app.get("/all", function(req, res) {
	//find all results from the ScrapedDataA collection in the db
db.scrapedDataA.find({}, function(error, found){
	//throw any errors to the console
	if (error) {
		console.log(error);
	}
	//if no errors, send data to the browser as json (bson?)
	else {
		res.json(found);
	}
});
});

// Scrape Route to send data from CNN and place it in the mongodb db
app.get("/scrape", function(req, res) {
// request for health section of CNN
request("http://www.cnn.com/health", function(error, response, html){
	var $ = cheerio.load(html);

$('h3.cd__headline').each(function(i, element) {
	//save the text of the element in a "title" variable
	let title = $(this).text();
	//in the selected element, look at child elements, 
	//then save the values for any "href" attr. of the child element
	let link = $(this).children("a").attr("href");
	//save an empty result object
	const result = {};
	//save results in an object and push into results array

	if (title && link) {
	db.scrapedDataA.save({
		title: title,
		link: url.resolve('http://www.cnn.com/',link)
	},
	function(error, saved) {
		if (error) {
			console.log(error);
		}
		else {
			console.log(saved);
		}
	});
};
});
});
//show the scrape is completed
res.send("Scrape complete")

});

//clearing the db
app.get("/clearall", function(req, res) {
  // Remove every title and link from scrapedDataA collection
  db.scrapedDataA.remove({}, function(error, response) {
    // Log any errors to the console
    if (error) {
      console.log(error);
      res.send(error);
    }
    // Otherwise, send the mongojs response to the browser
    // This will fire off the success function of the ajax request
    else {
      console.log(response);
      res.send(response);
    }
  });
});
// //telling console what serverA.js is doing
// console.log("\n===================\n" + "Grabbing every headline link from CNN's\n" + "health portal:" + 
// 	"\n===============================\n");

// //Making a request for CNN's health page. The page's HTML is passed as the callback's third argument
// request("http://www.cnn.com/health", function(error, response, html) {
// //saving html as a variable
// //'$' becomes a shorthand for cheerio's selector commands, like jQuery's '$'
// const $ = cheerio.load(html);
// //An empty array to save the data we'll scrape
// const results =[];

// //Within cheerio "API", find each(loop) h3 class of 'cd__headline'
// $('h3.cd__headline').each(function(i, element) {
// 	//save the text of the element in a "title" variable
// 	let title = $(element).text();
// 	//in the selected element, look at child elements, 
// 	//then save the values for any "href" attr. of the child element
// 	let link = $(element).children().attr("href");
// 	//save results in an object and push into results array
// 	results.push({
// 		title: title,
// 		link: link
// 	});
// });

// //Log the array results for each of the elements found with cheerio.js
// console.log(results);
// });

// Listen on port 3011
app.listen(3011, function() {
	console.log("App running on port 3011");
});