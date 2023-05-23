'use strict';

const { Sequelize, DataTypes } = require('sequelize');

const userModel = require('./users-model');

const DATABASE_URL = process.env.NODE_ENV === 'test' ? 'sqlite::memory:' : process.env.DATABASE_URL;

const sequelizeDatabase = new Sequelize(DATABASE_URL);

const userModelConstruct = userModel(sequelizeDatabase, DataTypes);

module.exports = {
  sequelizeDatabase,
  userModelConstruct,
};
