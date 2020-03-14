const express = require('express');
const router = express.Router();
const _ = require('lodash');
const { db, query } = require('./database/mysql');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

async function listPageCountQuery (list, page, cnt, callback) {
  // 총 갯수
  let totalCount = list.length;
  // 현재 요청한 page number
  let curPage = page;
  // 1페이지당 보여질 rows 수
  let rowSize = cnt;
  // 페이지 목록수 [1,2, 3, 4, 5] [2, 3, 4, 5, 6] 이런식으로..
  let pageListSize = 5;

  if(totalCount < 0) totalCount = 0;

  // 전체 갯수에서 cnt만큼 나눠서 전체 페이징 수를 구한다
  // 100개의 리스트가 있다면, 10개씩 보여줄 때 > totalpage는 10개 목록
  let totalPage = Math.ceil( totalCount/rowSize );

  // 만약 보여줄 페이지 목록 수가 기본설정보다 작을 때
  if(totalPage < pageListSize ) pageListSize = totalPage;

  // 최종적으로 계산된 Page수와 rowSize로 다시 계산
  //10개 목록 / 5 > 총 5개씩 된게 2개 있다. [1,2,3,4,5] > 다음버튼을 누르게 된다는거겠지..?
  let totalSet = Math.ceil(totalPage / pageListSize);
  //내가 요청한 페이지는 4번이라고 하면, totalSet 중에 어떤 set에 해당하는가 알수있음
  let curSet = Math.ceil(curPage / pageListSize)
  let startPage = ((curSet - 1) * pageListSize ) + 1
  let endPage = (startPage + pageListSize) - 1;

  if(totalPage < endPage) endPage = totalPage;

  let result = {
    totalCount,
    page: +curPage,
    rowSize,
    pageListSize,
    totalPage,
    totalSet,
    curSet,
    startPage,
    endPage,
  }
  return callback(result)
}

// mypage log history
router.get('/mypage', (req, res, next) => {
  let usernum = req.query.user;
  let { page, itemCnt } = req.body;
  let showList = (+page - 1) * 10;
  let body = {};
  db.query(`SELECT * FROM showplex.log where usernum="${usernum}"`, (err,results)=>{
    if(err) throw err;
    let logResult = JSON.parse(JSON.stringify(results));
    listPageCountQuery(logResult, page, itemCnt, (pageData)=>{
      db.query(`SELECT * FROM showplex.log where usernum="${usernum}" order by seq limit ${showList}, 10`, (err, rows) =>{
        if(err) throw err;
        let logData = JSON.parse(JSON.stringify(rows));
        body.log = logData;
        body.pageData = pageData;
        res.json(body)
      });
    });
  })
})

router.post('/profile/change', (req, res, next) => {
  console.log(req.body, 'req.body');
  // const { usernum, password, username, phone } = req.body;
  const { usernum, ...reqBody } = req.body;
  let body = {};
  let queryString = '';
  for(let key in reqBody){
    queryString += `${key}='${reqBody[key]}', `
  }
  query(`UPDATE showplex.user SET ${queryString.slice(0, queryString.length-2)} where usernum='${usernum}'`, (result) => {
    console.log(result, 'After update result');
    body.result = 1;
    db.query(`select * from showplex.user where usernum="${usernum}"`, async (error, results) => {
      if (error) throw error;
      if (results.length > 0) {
        body.userData = _.omit(results[0], ['password', 'verifyNumber']);
        res.json(body);
      };
    });
    
  });
})

module.exports = router;
