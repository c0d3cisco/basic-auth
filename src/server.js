'use strict';

// 3rd Party Resources
const express = require('express');
const cors = require('cors');
const app = express();
const error404 = require('./error-handlers/404');
const userRouter = require('./auth/router');

app.use(cors());

app.use(express.json());

app.use(userRouter);

app.use(express.urlencoded({ extended: true }));


// app.get('/', (req, res, next) => {
//   res.status(200).send('Hello');
// });

app.use('*', error404);

const start = (port) => {
  app.listen(port, () =>
    (console.log('Server is listening on', port)));
};

module.exports = {
  app,
  start,
};
