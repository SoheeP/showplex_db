var express = require('express');
var router = express.Router();
var _ = require('lodash');
var axios = require('axios');
var { KEY } = require('./database/apiKey');

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
});

// MOVIE

router.route('/movie/list')
.get(async (req, res, next) => {
  let query_arr = _.reduce(req.query, (arr, val, key) => {
    // 배열에 '요청하는 키 = 값' 내용으로 하나씩 순차적으로 삽입
    arr.push(`${key}=${val}`);
    return arr;
  }, [])
  let get_query = query_arr.join('&');
  if(query_arr.length === 1 && get_query.match('limit')){
    axios.get(`https://yts.tl/api/v2/list_movies.json&${get_query}`)
    .then((response) => {
      res.json(response.data)
    });
  } else {
    axios.get(`https://yts.mx/api/v2/list_movies.json?${get_query}`)
    .then((response) => {
      res.json(response.data)
    });
  }
})

router.route('/movie/detail')
.get(async (req, res, next) => {
  let query_arr = _.reduce(req.query, (arr, val, key) => {
    arr.push(`${key}=${val}`);
    return arr;
  }, [])
  let get_query = query_arr.join('&');
  axios.get(`https://yts.mx/api/v2/movie_details.json?${get_query}`)
  .then((response) => {
    res.json(response.data)
  });
})

router.route('/movie/suggestion')
.get(async (req, res, next) => {
  let query_arr = _.reduce(req.query, (arr, val, key) => {
    arr.push(`${key}=${val}`);
    return arr;
  }, [])
  let get_query = query_arr.join('&');

  axios.get(`https://yts.tl/api/v2/movie_suggestions.json?${get_query}`)
  .then((response) => {
    res.json(response.data)
  });
})

// PLAY
router.route('/play/list')
.get(async (req, res, next) => {
  let query_arr = _.reduce(req.query, (arr, val, key) => {
    arr.push(`${key}=${val}`);
    return arr;
  }, [])
  let get_query = query_arr.join('&');
  axios.get(`https://yts.tl/api/v2/movie_suggestions.json?${get_query}`)
  .then((response) => {
    res.json(response.data)
  })
});

router.route('/play/detail')
.get(async (req, res, next) => {
console.log(req.body.id);
  axios.get(`https://yts.mx/api/v2/movie_details.json?${get_query}`)
  .then((response) => {
    res.json(response.data)
  })
})

// PLAY
router.route('/musical/list')
.get(async (req, res, next) => {
  let query_arr = _.reduce(req.query, (arr, val, key) => {
    arr.push(`${key}=${val}`);
    return arr;
  }, [])
  let get_query = query_arr.join('&');
  axios.get(`https://yts.tl/api/v2/movie_suggestions.json?${get_query}`)
  .then((response) => {
    res.json(response.data)
  })
});

router.route('/musical/detail')
.get(async (req, res, next) => {
console.log(req.body.id);
  
  axios.get(`https://yts.mx/api/v2/movie_details.json?${get_query}`)
  .then((response) => {
    res.json(response.data)
  })
})

module.exports = router;
