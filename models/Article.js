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
		required: true
	},
	//link is a required string
	link: {
		type: String,
		required: true
	}
	//saved: {
		//type: Boolean,
		//default: false
	//}
	// This only saves one note's ObjectId, ref refers to the Note model
  // note: {
  //   type: Schema.Types.ObjectId,
  //   ref: "Note"
  // }
});

//Create the Article model with the ArticleSchema
let Article = mongoose.model("Article", ArticleSchema);
//export the model
console.log("Could be the same " + Article)
 module.exports = Article;