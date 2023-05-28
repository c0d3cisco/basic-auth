'use strict';

const bcrypt = require('bcrypt');
const base64 = require('base-64');
const { userModelConstruct } = require('../models');


const basicAuth = async (req, res, next) => {

  let basicHeaderParts = req.headers.authorization.split(' ');  // ['Basic', 'am9objpmb28=']
  let encodedString = basicHeaderParts.pop();  // am9objpmb28=
  let decodedString = base64.decode(encodedString); // "username:password"
  let [username, password] = decodedString.split(':'); // username, password

  try {
    const user = await userModelConstruct.findOne({ where: { username: username } });


    const valid = await bcrypt.compare(password, user.password);
    if (valid) {
      req.user = user;
      next();
    }
    else {
      throw new Error('Invalid User');


    }
  } catch (error) { next('Not authorized (user doesn\'t exist in DB)'); }

};

module.exports = basicAuth;
