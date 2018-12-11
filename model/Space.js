const mongoose = require('mongoose');
const validator = require('validator');

const model = mongoose.model('Space', {
  owner: {
    type: Long,
    required: true,
    validate: {
      validator(owner) {
        return validator.isNumeric(owner);
      },
    },
  },
  name: {
    type: String,
    required: true,
    validate: {
      validator(name) {
        return validator.isAlphanumeric(name);
      },
    },
  },
  description: {
    type: String,
    required: true,
    validate: {
      validator(description) {
        return validator.isAlphanumeric(description);
      },
    },
  }
});

module.exports = model;
