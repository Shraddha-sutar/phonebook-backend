// models/person.js
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;
console.log('connecting to', url);

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('connected to MongoDB'))
  .catch((error) => console.error('error connecting to MongoDB:', error.message));

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name required'],
    minlength: [3, 'Name must be at least 3 characters long']
  },
  number: {
    type: String,
    required: [true, 'Number required'],
    minlength: [8, 'Number must be at least 8 characters long'],
    validate: {
      validator: function (v) {
        // first part: 2 or 3 digits, dash, then one or more digits
        return /^\d{2,3}-\d+$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  }
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Person', personSchema);
