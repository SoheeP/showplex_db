const express = require('express');
const router = express.Router();
const _ = require('lodash');
const moment = require('moment');
const { db, query } = require('./database/mysql');

router.get('/freeboard', (req, res, next) => {
  db.query(`SELECT * FROM showplex.freeboard;`, (error, results) => {
    if(error) throw error;
    res.json(results);
  })
})

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

router.get('/detail', (req, res, next) => {
  let id = req.body.id;
  console.log(req.body);
  db.query(`SELECT * FROM showplex.freeboard where id='${id}'`, (error, results) =>{
    if(error) throw error;
    if(results.length > 0){
    res.json(results[0])
    } else {
      // id 없을 경우
      res.json({result: 2})
    }
  })
})

module.exports = router;
