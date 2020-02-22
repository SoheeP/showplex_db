const express = require('express');
const router = express.Router();
const _ = require('lodash');
const moment = require('moment');
const { db, query } = require('./database/mysql');

router.post('/write', (req, res, next) => {
  let username = req.body.username,
  title = req.body.title,
  contents = req.body.contents,
  time = moment().format('YYYY/MM/DD hh:mm:ss');
  db.query(`select * from showplex.user where username="${username}"`, (error, results) => {
    if(error) throw error;
    if(results.length > 0){
      query(`INSERT INTO showplex.freeboard (title, contents, author, time) VALUES ("${title}", "${contents}", "${username}", "${time}")`)
      console.log(req.body);
      res.json({ result : 1 });
    } else {
      res.json({ result: 2 });
    };
  });
});

module.exports = router;
