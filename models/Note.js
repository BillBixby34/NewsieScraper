// Require mongoose
const mongoose = require("mongoose");
// Create a schema class
const Schema = mongoose.Schema;

// Create the Note schema
const NoteSchema = new Schema({
  // Just a string
  title: {
    type: String,
    unique: true,
  },
  // Just a string
  body: {
    type: String,
    validate: [
      // Function takes in the value as an argument
      function(input) {
        // If this returns true, proceed. If not, return an error message
        return input.length >= 1;
      },
      // Error Message
      "Any note should be longer."
    ]
  }
});

//Mongoose will automatically save the ObjectIds of the notes
//ids are referred to in the Article model

// Create the Note model with the NoteSchema
var Note = mongoose.model("Note", NoteSchema);

// Export the Note model
module.exports = Note;
