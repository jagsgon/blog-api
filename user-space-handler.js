const mongoose = require('mongoose');
const Promise = require('bluebird');
const validator = require('validator');
const SpaceModel = require('./model/Space.js');

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

module.exports.createSpace = (event, context, callback) => {
  const data = JSON.parse(event.body);

  const space = new SpaceModel({
    owner: data.owner,
    name: data.name,
    description: data.description
  });

  if (space.validateSync()) {
    callback(null, createErrorResponse(400, 'Incorrect data'));
    return;
  }

  dbConnectAndExecute(mongoString, () => (
    space
      .save()
      .then(() => callback(null, {
        statusCode: 200,
        body: JSON.stringify({ id: space.id })
      }))
      .catch(err => callback(null, createErrorResponse(err.statusCode, err.message)))
  ));
};

module.exports.listUserSpaces = (event, context, callback) => {
  if (!validator.isAlphanumeric(event.pathParameters.id)) {
    callback(null, createErrorResponse(400, 'Incorrect id'));
    return;
  }

  dbConnectAndExecute(mongoString, () => (
    SpaceModel
      .findAll({ owner: event.pathParameters.id })
      .then(spaces => callback(null, { statusCode: 200, body: JSON.stringify(spaces) }))
      .catch(err => callback(null, createErrorResponse(err.statusCode, err.message)))
  ));
};
