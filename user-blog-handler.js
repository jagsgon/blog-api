const mongoose = require('mongoose');
const Promise = require('bluebird');
const validator = require('validator');
const BlogModel = require('./model/Blog.js');
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

module.exports.createBlog = (event, context, callback) => {
  if (event.pathParameters.id == null || ! validator.isAlphanumeric(event.pathParameters.id) ||
       event.pathParameters.sid == null || ! validator.isAlphanumeric(event.pathParameters.sid) ) {
    callback(null, createErrorResponse(400, 'Incorrect id'));
    return;
  }
  const data = JSON.parse(event.body);

  const blog = new BlogModel({
    owner: event.pathParameters.id,
    space: event.pathParameters.sid,
    name: data.name,
    description: data.description
  });

  if (blog.validateSync()) {
    callback(null, createErrorResponse(400, 'Incorrect data'));
    return;
  }

  dbConnectAndExecute(mongoString, () => (
    blog
      .save()
      .then(() => callback(null, {
        statusCode: 200,
        body: JSON.stringify({ id: blog.id })
      }))
      .catch(err => callback(null, createErrorResponse(err.statusCode, err.message)))
  ));
};

module.exports.listUserBlogs = (event, context, callback) => {
  if (event.pathParameters.id == null ||  !validator.isAlphanumeric(event.pathParameters.id)) {
    callback(null, createErrorResponse(400, 'Incorrect id'));
    return;
  }

  dbConnectAndExecute(mongoString, () => (
    BlogModel
      .findAll({ owner: event.pathParameters.id })
      .then(blogs => callback(null, { statusCode: 200, body: JSON.stringify(blogs) }))
      .catch(err => callback(null, createErrorResponse(err.statusCode, err.message)))
  ));
};


module.exports.approveBlog = (event, context, callback) => {
  const id = event.pathParameters.id;

  if (id == null || !validator.isAlphanumeric(id)) {
    callback(null, createErrorResponse(400, 'Incorrect id'));
    return;
  }

  const blog =   dbConnectAndExecute(mongoString, () => (
      BlogModel.find({ _id: id });

  if (blog != null ) {
    const space =   dbConnectAndExecute(mongoString, () => (
      SpaceModel.find({ _id: blog.space });

      if (space != null) {
        if (space.owner.equals(id)) {
         blog.approve = true
        }
      }

  }

  if (! blog.approve) {
    callback(null, createErrorResponse(401, 'Incorrect id'));
  } else {
    dbConnectAndExecute(mongoString, () => (
      blog
        .save()
        .then(() => callback(null, {
          statusCode: 200,
          body: JSON.stringify({ id: blog.id })
        }))
        .catch(err => callback(null, createErrorResponse(err.statusCode, err.message)))
    ));
  }

};

module.exports.listAllBlogs = (event, context, callback) => {
  if (event.pathParameters.id ==null || !validator.isAlphanumeric(event.pathParameters.id)) {
    callback(null, createErrorResponse(400, 'Incorrect id'));
    return;
  }

  dbConnectAndExecute(mongoString, () => (
    BlogModel
      .findAll({ })
      .then(blogs => callback(null, { statusCode: 200, body: JSON.stringify(blogs) }))
      .catch(err => callback(null, createErrorResponse(err.statusCode, err.message)))
  ));
};
