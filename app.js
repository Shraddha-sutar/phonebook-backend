// app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const personsController = require('./controllers/persons');
const Person = require('./models/person');
const { unknownEndpoint, errorHandler } = require('./utils/middleware');

const app = express();

app.use(cors());
app.use(express.static('build')); // serve frontend build if present
app.use(express.json());

// info route (uses DB)
app.get('/info', async (req, res, next) => {
  try {
    const count = await Person.countDocuments({});
    res.send(`<p>Phonebook has info for ${count} people</p><p>${new Date()}</p>`);
  } catch (err) {
    next(err);
  }
});

// api routes
app.get('/api/persons', personsController.getAllPersons);
app.get('/api/persons/:id', personsController.getPersonById);
app.post('/api/persons', personsController.createPerson);
app.delete('/api/persons/:id', personsController.deletePerson);
app.put('/api/persons/:id', personsController.updatePerson);

// fallback middleware
app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
