//Require mongoose
const mongoose = require("mongoose");
//Create Schema class
const Schema = mongoose.Schema;

//Create article schema
let ArticleSchema = new Schema({
	//title is a required string
	title: {
		type: String,
		required: true
	},
	//link is a required string
	link: {
		type: String,
		required: true
	}
});

//Create the Article model with the ArticleSchema
const Article = mongoose.model("Article", ArticleSchema);
//export the model
 //module.exports = Article;