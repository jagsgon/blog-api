const mongoose = require('mongoose');
const Promise = require('bluebird');
const validator = require('validator');
const UserModel = require('./model/User.js');

mongoose.Promise = Promise;

const mongoString = process.env.npm_package_config_mongo_url; // MongoDB Url

const createErrorResponse = (statusCode, message) => ({
  statusCode: statusCode || 501,
  headers: { 'Content-Type': 'text/plain' },
  body: message || 'Incorrect id'
});

const dbExecute = (db, fn) => db.then(fn).finally(() => db.close());

function dbConnectAndExecute(dbUrl, fn) {
  return dbExecute(mongoose.connect(dbUrl, { useMongoClient: true }), fn);
}

module.exports.createUser = (event, context, callback) => {
  const data = JSON.parse(event.body);

  const user = new UserModel({
    userId: data.userId,
    passwd: data.passwd,
    firstname: data.firstname,
    lastname: data.lastname,
    phoneNumber: data.phoneNumber,
    ip: event.requestContext.identity.sourceIp
  });

  if (user.validateSync()) {
    callback(null, createErrorResponse(400, 'Incorrect user data'));
    return;
  }

  dbConnectAndExecute(mongoString, () => (
    user
      .save()
      .then(() => callback(null, {
        statusCode: 200,
        body: JSON.stringify({ id: user.id })
      }))
      .catch(err => callback(null, createErrorResponse(err.statusCode, err.message)))
  ));
};

module.exports.authUser = (event, context, callback) => {
  const data = JSON.parse(event.body);

  const user = new UserModel({
    userId: data.userId,
    passwd: data.passwd
  });

  if (user.validateSync()) {
    callback(null, createErrorResponse(400, 'Incorrect user data'));
    return;
  }

  dbConnectAndExecute(mongoString, () => (
    UserModel
      .find({ userId: user.userId, passwd: user.passwd })
      .then(user.passwd = null). // remove password from user object
      .then(user.ip = null).  // remove ip
      .then(user => callback(null, { statusCode: 200, body: JSON.stringify(user) }))
      .catch(err => callback(null, createErrorResponse(err.statusCode, err.message)))
  ));
};
