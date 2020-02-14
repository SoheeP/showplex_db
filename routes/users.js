var express = require('express');
var router = express.Router();
const { db, query } = require('./database/mysql');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// mypage log history
router.get('/mypage', (req, res, next) => {
  let usernum = req.query.user;
  db.query(`SELECT * FROM showplex.log where usernum="${usernum}"`,(err,results)=>{
    if(err) throw err;
    let logResult = JSON.parse(JSON.stringify(results));

    res.json({log: logResult})
  })
})

router.post('/profile/change', (req, res, next) => {
  console.log(req.body);
  const { usernum, password, username, phone } = req.body;
  const changeData = _.omitBy([password, username, phone], _.isUndefined);
  const body = {};
  console.log(changeData);
  query(`UPDATE user SET username='${username}', password='${password}', phone='${phone}'  where usernum='${usernum}'`, (result) => {
    console.log(result);
    body.result = 1;
    res.json(body);
  })
})

module.exports = router;
