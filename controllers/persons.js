const express = require('express');
const Person = require('./models/person');
const router = express.Router();

// ✅ Get all persons
router.get('/', async (req, res) => {
  try {
    const persons = await Person.find({});
    res.json(persons);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch persons' });
  }
});

// ✅ Add new person
router.post('/', async (req, res) => {
  try {
    const { name, number } = req.body;

    if (!name || !number) {
      return res.status(400).json({ error: 'Name or number missing' });
    }

    const newPerson = new Person({ name, number });
    const savedPerson = await newPerson.save();

    // 🔹 हे महत्त्वाचे: React मध्ये notification साठी पूर्ण object पाठवा
    res.status(201).json({
      message: 'Person added successfully',
      person: savedPerson,
    });

  } catch (error) {
    res.status(500).json({ error: 'Failed to add person' });
  }
});

// ✅ Delete person
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Person.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Person not found' });
    }
    res.json({ message: 'Person deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting person' });
  }
});

module.exports = router;
