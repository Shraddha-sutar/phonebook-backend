const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

// MongoDB connection
const url = process.env.MONGODB_URI
mongoose.connect(url)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.log('Error connecting to MongoDB:', error))

// Mongoose Schema and Model
const personSchema = new mongoose.Schema({
  name: String,
  number: String
})
const Person = mongoose.model('Person', personSchema)

// Routes
app.get('/api/persons', async (req, res) => {
  const persons = await Person.find({})
  res.json(persons)
})

app.post('/api/persons', async (req, res) => {
  const { name, number } = req.body
  const person = new Person({ name, number })
  const savedPerson = await person.save()
  res.json(savedPerson)
})

app.put('/api/persons/:id', async (req, res) => {
  const { name, number } = req.body
  const updatedPerson = await Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true }
  )
  res.json(updatedPerson)
})

app.delete('/api/persons/:id', async (req, res) => {
  await Person.findByIdAndRemove(req.params.id)
  res.status(204).end()
})

// Serve frontend build
app.use(express.static('build'))

// Dynamic port for Render
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
