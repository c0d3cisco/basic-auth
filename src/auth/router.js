'use strict';

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
// const base64 = require('base-64');

const basicAuth = require('./middleware/basic');

const { userModelConstruct } = require('./models');

router.post('/signup', async (req, res) => {

  try {
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const record = await userModelConstruct.create(req.body);
    res.status(201).json(record);
  } catch (e) { res.status(403).send(e.message); }
});

router.post('/signin', basicAuth, (req, res, next) => {
  res.status(200).json(req.user);
});

module.exports = router;
