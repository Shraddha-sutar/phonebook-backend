personsRouter.post('/', (req, res) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: 'Name and Number required' });
  }

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

  try {
    writeDB(data);
    res.status(201).json(newPerson);
  } catch (err) {
    console.error('Error writing to db.json:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
