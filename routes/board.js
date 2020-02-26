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
  let { usernum, username, title, contents } = req.body;
  let time = moment().format('YYYY-MM-DD hh:mm:ss');
  db.query(`select * from showplex.user where usernum="${usernum}"`, (error, results) => {
    if(error) throw error;
    if(results.length > 0){
      query(`INSERT INTO showplex.freeboard (usernum, title, contents, author, time) VALUES ("${usernum}", "${title}", "${contents}", "${username}", "${time}")`)
      console.log(req.body);
      res.json({ result : 1 });
    } else {
      res.json({ result: 2 });
    };
  });
});

router.post('/delete', (req, res, next) => {
  let { usernum, id } = req.body;
  db.query(`select * from showplex.user where usernum="${usernum}"`, (error, results) => {
    if(error) throw error;
    if(results.length > 0){
      query(`DELETE FROM showplex.freeboard WHERE id='${id}' and usernum = ${usernum};`, (results) => {
        //삭제 완료
        console.log(req.body);
        res.json({ result : 1 });
      })
    } else {
      //삭제 실패
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
