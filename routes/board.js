const express = require('express');
const router = express.Router();
const _ = require('lodash');
const { db, query } = require('./database/mysql');

router.post('/write', (req, res, next) => {
  res.json({result : 1});
})

module.exports = router;
