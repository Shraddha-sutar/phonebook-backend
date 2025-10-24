// controllers/persons.js
const Person = require('../models/person')

// GET all persons
const getAllPersons = async (req, res, next) => {
  try {
    const persons = await Person.find({})
    res.json(persons)
  } catch (err) {
    next(err)
  }
}

// GET a person by ID
const getPersonById = async (req, res, next) => {
  try {
    const person = await Person.findById(req.params.id)
    if (person) {
      res.json(person)
    } else {
      res.status(404).json({ error: 'Person not found' })
    }
  } catch (err) {
    next(err)
  }
}

// CREATE new person
const createPerson = async (req, res, next) => {
  try {
    const { name, number } = req.body

    // Check for duplicate name
    const existing = await Person.findOne({ name })
    if (existing) {
      return res.status(409).json({ error: 'Name must be unique; use update to change number' })
    }

    const person = new Person({ name, number })
    const saved = await person.save()
    res.status(201).json(saved)
  } catch (err) {
    next(err)
  }
}

// DELETE a person
const deletePerson = async (req, res, next) => {
  try {
    const result = await Person.findByIdAndDelete(req.params.id)
    if (!result) {
      return res.status(404).json({ error: 'Person not found' })
    }
    res.status(204).end()
  } catch (err) {
    next(err)
  }
}

// UPDATE a person
const updatePerson = async (req, res, next) => {
  const { name, number } = req.body
  const update = { name, number }

  try {
    const updated = await Person.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true, context: 'query' } // ensures Mongoose validators run on update
    )
    if (updated) {
      res.json(updated)
    } else {
      res.status(404).json({ error: 'Person not found' })
    }
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getAllPersons,
  getPersonById,
  createPerson,
  deletePerson,
  updatePerson
}
