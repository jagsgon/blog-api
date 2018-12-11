
<!--
title: workday blog api
description: Workday blog api using MongoDB with AWS and Serverless AWS Lambda.
layout: Doc
framework: v1
platform: AWS Lambda, AWS MongoDB
language: nodeJS
author: Jagadeesh Gondesi
date: 10, December 2018
-->
# blog-api
Blog API based on nodeJS, Serverless, MongoDB, Mongoose and AWS Lambda
A Serverless MongoDB based REST API to support blogging backend.

Using Mongoose, ODM and Bluebird for Promises.

# Pre Requisite
- Install nodeJS
- Install nodeJS Serverless CLI tool. --> npm install -g serverless
- Need access to AWS account, to create instances and deploy and run code.
- Export AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY credentials in your local shell.

# Assumptions / Miscellaneous:
- Security is handled by SSL : https
- We should implement JWT based authentication and authorization in Next version, for better security controls. // time constraint
- Automated unit tests not implemented due to time constraint.
- Change you mongoDB url in package.json in config.mongo_url

## Use Cases

- register User
- login
- create a blogging space
- create a blog
- modify a blog
- approve blog (by space owner)
- retrieve blogs

## Setup

```
npm install
serverless deploy
```

## Usage

In `handler.js` update the `mongoString` with your mongoDB url.

*Register User*

```bash
curl -XPOST -H "Content-type: application/json" -d '{
   "userId" : "jdoe@workday.example.com",
   "passwd" : "W0rkD@y",
   "firstname" : "John",
   "lastname" : "Doe",
   "phone" : "9253334444"
}' 'https://YOUR-ENDPOINT-HERE.amazonaws.com/dev/user/'
```
```json
{"id": "590bpow086041086882cecc"}
```

*User Login*

```bash
curl -XPOST -H "Content-type: application/json" -d '{
  "userId" : "jdoe@workday.example.com",
  "passwd" : "W0rkD@y"
}' 'https://YOUR-ENDPOINT-HERE.amazonaws.com/dev/user/login'
```
```json
{
  "_id": "590bpow086041086882cecc",
  "userId" : "jdoe@workday.example.com",
  "firstname" : "John",
  "lastname" : "Doe",
  "phone" : "9253334444"
}
```

*Create User Space*

```bash
curl -XPOST -H "Content-type: application/json" -d '{
   "space" : "myNewSpace",
   "description" : "Here is my big long blog content......."
}' 'https://YOUR-ENDPOINT-HERE.amazonaws.com/dev/user/590bpow086041086882cecc/space'
```
```json
{"id": "4554sdss65656"}
```

*List user spaces*

```bash
curl -XGET -H "Content-type: application/json" 'https://YOUR-ENDPOINT-HERE.amazonaws.com/dev/user/590bpow086041086882cecc/space'
```
```json
[
  {
    "_id": "4554sdss65656",
    "space" : "myNewSpace",
    "description" : "Here is my big long blog content.......",
    "__v": 0
  },
  {
    "_id": "6554sdssj656",
    "space" : "myAnotherNewSpace",
    "description" : "Here is my even bigger long blog content.......",
    "__v": 0
  }
]
```

*Create User Blog*

```bash
curl -XPOST -H "Content-type: application/json" -d '{
   "name" : "Our first blog!",
   "description" : "Very happy to bring this article to you fun loving audience......."
}' 'https://YOUR-ENDPOINT-HERE.amazonaws.com/dev/user/590bpow086041086882cecc/space/4554sdss65656/blog'
```
```json
{"id": "97868blog34977"}
```

*List all blogs*

```bash
curl -XGET -H "Content-type: application/json" 'https://YOUR-ENDPOINT-HERE.amazonaws.com/dev/blog'
```
```json
[
  {
    "_id" : "97868blog34977",
    "owner" : "590bpow086041086882cecc",
    "space" : "myNewSpace",
    "name" : "Our first blog!",
    "description" : "Very happy to bring this article to you fun loving audience.......",
    "__v": 0
  },
  {
    "_id": "76868blog34978",
    "owner" : "590bpow086041086882cecc",
    "space" : "myNewSpace",
    "name" : "Our second blog!",
    "description" : "Very happy to bring our #2 article to you fun loving audience.......",
    "__v": 0
  }
]

*List User blogs*

```bash
curl -XGET -H "Content-type: application/json" 'https://YOUR-ENDPOINT-HERE.amazonaws.com/dev/user/590bpow086041086882cecc/blog'
```
```json
[
  {
    "_id" : "97868blog34977",
    "owner" : "590bpow086041086882cecc",
    "space" : "myNewSpace",
    "name" : "Our first blog!",
    "description" : "Very happy to bring this article to you fun loving audience.......",
    "__v": 0
  },
  {
    "_id": "76868blog34978",
    "owner" : "590bpow086041086882cecc",
    "space" : "myNewSpace",
    "name" : "Our second blog!",
    "description" : "Very happy to bring our #2 article to you fun loving audience.......",
    "__v": 0
  }
]

