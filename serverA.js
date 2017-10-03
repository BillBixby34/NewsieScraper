//require cheerios to parse html and find elements
const cheerio = require('cheerio');
//makes http request for html page
const request = require('request');
//telling console what serverA.js is doing
console.log("\n===================\n" + "Grabbing every headline link from CNN's\n" + "health portal:" + 
	"\n===============================\n");
//Making a request for CNN's health page. The page's HTML is passed as the callback's third argument
request("http://www.cnn.com/health", function(error, response, html) {
//saving html as a variable
//'$' becomes a shorthand for cheerio's selector commands, like jQuery's '$'
const $ = cheerio.load(html);
//An empty array to save the data we'll scrape
const results =[];
//Within cheerio "API", find each (loop) article class of 'cd'
$('h3.cd__headline').each(function(i, element) {
	//save the text of the element in a "title" variable
	let title = $(element).text();
	//in the selected element, look at child elements, 
	//then save the values for any "href" attr. of the child element
	let link = $(element).children().attr("href");
	//save results in an object and push into results array
	results.push({
		title: title,
		link: link
	});
});
//Log the array results for each of the elements found with cheerio.js
console.log(results);
});