const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const personsRouter = require('./controllers/persons');
const unknownEndpoint = require('./middleware/unknownEndpoint');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

app.use('/api/persons', personsRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
