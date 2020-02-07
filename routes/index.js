var express = require('express');
var router = express.Router();
var _ = require('lodash');
var axios = require('axios');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
router.get('/', async function(req, res, next) {
  console.log(req.query, 'index query')
  let query_arr = _.reduce(req.query, (arr, val, key) => {
    // 배열에 '요청하는 키 = 값' 내용으로 하나씩 순차적으로 삽입
    arr.push(`${key}=${val}`);
    return arr;
  }, [])
  let get_query = query_arr.join('&');

  axios.get(`https://yts.tl/api/v2/list_movies.json?${get_query}`)
  .then((response) => {
    res.json(response.data)
  });
  res.render('index', { title: 'Express' });
});


module.exports = router;
