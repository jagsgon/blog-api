const mongoose = require('mongoose');
const validator = require('validator');

const model = mongoose.model('Blog', {
  owner: {
    type: Long,
    required: true,
    validate: {
      validator(owner) {
        return validator.isNumeric(owner);
      },
    },
  },
  space: {
    type: String,
    required: true,
    validate: {
      validator(space) {
        return validator.isAlphanumeric(space);
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
  },
  approved: {
    type: Boolean,
    validate: {
      validator(approved) {
        return validator.isBoolean(approved);
      },
    },
  }
});

module.exports = model;
