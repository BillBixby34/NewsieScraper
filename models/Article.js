//Require mongoose
const mongoose = require("mongoose");
//Create Schema class
const Schema = mongoose.Schema;

//Create article schema
//const or let?
let ArticleSchema = new Schema({
	//title is a required string
	title: {
		type: String,
		unique: true
	},
	//link is a required string
	link: {
		type: String,
		required: true
	},
	saved: {
		type: Boolean,
		default: false
	},
	// notes is an array that stores ObjectIds
  // The ref property links these ObjectIds to the Note model
  // This will let us populate the saved Articles with these notes, rather than the ids,
  // using Mongoose's populate method (See the routes in Server.js)
   note: [{
    type: Schema.Types.ObjectId,
     ref: "Note"
   }]
});

//Create the Article model with the ArticleSchema
let Article = mongoose.model("Article", ArticleSchema);
//export the model
console.log("Could be the same " + Article)
 module.exports = Article;