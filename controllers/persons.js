// Node.js + Express + Mongoose example
const express = require('express');
const Person = require('./models/person'); // mongoose model
const router = express.Router();

// Get all persons
router.get('/', async (req, res) => {
  const persons = await Person.find({});
  res.json(persons);
});

// Add new person
router.post('/', async (req, res) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: 'Name or number missing' });
  }

  const newPerson = new Person({ name, number });
  const savedPerson = await newPerson.save();

  // ✅ Important: Return the saved object
  res.json(savedPerson);
});

// Delete person
router.delete('/:id', async (req, res) => {
  await Person.findByIdAndRemove(req.params.id);
  res.status(204).end();
});

module.exports = router;
