const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const {
  readFromFile,
  readAndAppend,
  writeToFile,
} = require('../helpers/fsUtils');

// GET route for retrieving ALL the notes/tasks
notes.get('/', (req, res) => {
  readFromFile('../db/db.json').then((data) => res.json(JSON.parse(data)));
});

// GET route for a specific note/task
notes.get('/:notes_id', (req, res) => {
  const noteId = req.params.note_id;
  readFromFile('./db/db.json')
  .then((data) => JSON.parse(data))
  .then((json) => {
    const result = json.filter((note) => note.note_id === noteId);
    return result.length > 0 
    ? res.json(result)
    : res.json('No notes with that ID');
  });
});

// DELETE Route for a specific task
// BONUS QUESTION DOUBLE JEOPARDY
notes.delete('/:note_id', (req, res) => {
  const noteId = req.params.note_id;
  readFromFile('./db/db.json')
  .then((data) => JSON.parse(data))
  .then((json) => {
    // make new array of all tips except the one with the ID provided in the URL
    const result = json.filter((note) => note.note_id !== noteId);
    // save that array to the filesystem
    writeToFile('./db/db.json', result);
    // respond to the delete request
    res.json(`${noteId} has been trashed 🗑️`);
  });
});

//POST route for a new note/task
notes.post('/', (req, res) => {
  console.log(req.body);
  const { note, description } = req.body;

  if (req.body) {
    const newNote = {
      note,
      description,
      note_id: uuidv4(),
    };

    readAndAppend(newNote, './db/db.json');
    res.json(`Task added, success! 🚀`);
  } else {
    res.errored('Error! Ya did it wrong');
  }
  });

  module.exports = notes;