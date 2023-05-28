'use strict';

require('dotenv').config();

const { sequelizeDatabase } = require('./src/auth/models');

const { start } = require('./src/server');

const PORT = process.env.PORT || 3002;

sequelizeDatabase.sync()
  .then(() => {
    console.log('Successful Connection on ', PORT);
    start(PORT);
  })
  .catch(e => console.error(e));
