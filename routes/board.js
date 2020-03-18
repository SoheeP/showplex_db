const express = require('express');
const router = express.Router();
const _ = require('lodash');
const moment = require('moment');
const { db, query } = require('./database/mysql');

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

router.get('/freeboard', (req, res, next) => {
  let { page, itemCnt } = req.body;
  let showList = (+page - 1) * 10;
  let body = {};

  db.query(`SELECT * FROM showplex.freeboard;`, (error, results) => {
    if(error) throw error;
    let listResult = JSON.parse(JSON.stringify(results));

    listPageCountQuery(listResult, page, itemCnt, (pageData)=>{
      db.query(`SELECT * FROM showplex.freeboard order by id limit ${showList}, 10`, (err, rows) =>{
        if(err) throw err;
        let list = JSON.parse(JSON.stringify(rows));
        body.list = list;
        body.pageData = pageData;
        res.json(body)
      });
    })
  })
});

router.post('/write', (req, res, next) => {
  let { usernum, username, title, contents } = req.body;
  let time = moment().format('YYYY-MM-DD hh:mm:ss');
  let replaceContents = contents.replace(/\"/g, "\'");
  console.log(replaceContents);
  db.query(`select * from showplex.user where usernum="${usernum}"`, (error, results) => {
    if(error) throw error;
    if(results.length > 0){
      query(`INSERT INTO showplex.freeboard (usernum, title, contents, author, time) VALUES ("${usernum}", "${title}", "${replaceContents}", "${username}", "${time}")`)
      console.log(req.body);
      res.json({ result : 1 });
    } else {
      res.json({ result: 2 });
    };
  });
});
router.route('/modify')
.get((req, res, next) => {
  // 내용 뿌려주기
  let { id, usernum } = req.body;
  db.query(`select * from showplex.freeboard where id="${id}" and usernum="${usernum}"`, (error, results) => {
    if(error) throw error;
    if(results.length > 0){
      res.json(results[0]);
    } else {
      // 게시글을 찾을 수 없음
      res.json({ result: 2 });
    };
  });
})
.post((req, res, next) => {
  let { id, usernum, username, title, contents } = req.body;

  let time = moment().format('YYYY-MM-DD hh:mm:ss');
  db.query(`select * from showplex.freeboard where id="${id}" and usernum="${usernum}"`, (error, results) => {
    if(error) throw error;
    if(results.length > 0){
      query(`UPDATE showplex.freeboard SET title="${title}", contents="${contents}", author="${username}", time="${time}" WHERE id="${id}"`, (result) => {
        res.json({ result : 1 });
      })
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
    };
  });
})

module.exports = router;
