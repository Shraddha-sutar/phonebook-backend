const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;
const DB_FILE = './db.json';

// Read data from db.json
const readDB = () => {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading db.json:', error);
    return { persons: [] };
  }
};

// Write data to db.json
const writeDB = (data) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing db.json:', error);
  }
};

// Get all persons
app.get('/api/persons', (req, res) => {
  const data = readDB();
  res.json(data.persons);
});

// Add new person
app.post('/api/persons', (req, res) => {
  const { name, number } = req.body;
  if (!name || !number) return res.status(400).json({ error: 'Name and Number required' });

  const data = readDB();
  if (data.persons.find(p => p.name === name)) {
    return res.status(400).json({ error: 'Name already exists' });
  }

  const newPerson = {
    id: Math.max(...data.persons.map(p => p.id), 0) + 1,
    name,
    number
  };

  data.persons.push(newPerson);
  writeDB(data);
  res.status(201).json(newPerson);
});

// Delete person
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const data = readDB();
  data.persons = data.persons.filter(p => p.id !== id);
  writeDB(data);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
