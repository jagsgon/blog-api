const mongoose = require('mongoose');
const validator = require('validator');

/*
userId: data.userId,
passwd: data.passwd,
firstname: data.firstname,
lastname: data.lastname,
phoneNumber: data.phoneNumber,
//verified: data.lastname,
ip: event.requestContext.identity.sourceIp,

*/
const model = mongoose.model('User', {
  userId: {
    type: String,
    required: true,
    validate: {
      validator(userId) {
        return validator.isAlphanumeric(userId);
      },
    },
  },
  passwd: {
    type: String,
    required: true,
    validate: {
      validator(passwd) {
        return validator.isAlphanumeric(passwd);
      },
    },
  },
  firstname: {
    type: String,
    required: true,
    validate: {
      validator(firstname) {
        return validator.isAlphanumeric(firstname);
      },
    },
  },
  lastname: {
    type: String,
    required: true,
    validate: {
      validator(lastname) {
        return validator.isAlphanumeric(lastname);
      },
    },
  },
  phoneNumber: {
    type: String,
    required: true,
    validate: {
      validator(phoneNumber) {
        return validator.isNumeric(phoneNumber);
      },
    },
  },
  verified: {
    type: Boolean,
    validate: {
      validator(verified) {
        return validator.isBoolean(verified);
      },
    },
  },
  creationDate: {
    type: Date,
  },
  updatedDate: {
    type: Date,
  },
  ip: {
    type: String,
    required: true,
    validate: {
      validator(ip) {
        return validator.isIP(ip);
      },
    },
  }
});

module.exports = model;
