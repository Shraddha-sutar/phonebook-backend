const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// ✅ 1️⃣ — हे बदल अत्यंत महत्त्वाचे आहेत:
app.use(cors({
  origin: '*',            // सगळ्या origins ना परवानगी
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());
app.use(express.static('build'));

// ✅ MongoDB connection
const url = process.env.MONGODB_URI;
mongoose.connect(url)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(error => console.error('❌ Error connecting to MongoDB:', error.message));

// ✅ Schema & Model
const personSchema = new mongoose.Schema({
  name: String,
  number: String
});
const Person = mongoose.model('Person', personSchema);

// ✅ Routes
app.get('/api/persons', async (req, res) => {
  const persons = await Person.find({});
  res.json(persons);
});

app.post('/api/persons', async (req, res) => {
  const { name, number } = req.body;
  const person = new Person({ name, number });
  const saved = await person.save();
  res.json(saved);
});

app.delete('/api/persons/:id', async (req, res) => {
  try {
    await Person.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Error deleting person' });
  }
});

// ✅ Port
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
