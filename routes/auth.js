var express = require('express');
var router = express.Router();
var _ = require('lodash');
var axios = require('axios');
var {
  db,
  query
} = require('./database/mysql');

const moment = require('moment');
const geoip = require('geoip-lite');


router.route('/signup')
.post(async (req, res, next) => {

  const email  = req.body.email,
  password     = req.body.password,
  username     = req.body.username,
  phone        = req.body.phone,
  verifycation = req.body.verifycation;
  // capcha로 우선 설정
  let verify, result;

  /** 
   * NOTE: result 값 
   * 1: 가입 완료
   * 2: 무엇인가의 에러로 인한 실패
   * 3: 인증 실패
   * 4: 중복 체크
   * */ 
  if(verifycation.length === 0){
    result = { result: 3 };
    res.json(result)
  } else {
    verify = 1;
    db.query(`select * from user where email="${email}"`, (err, results) => {
      if(err) throw err;
      console.log(results, 'BACK:: Result');
      if(results.length > 0 ){
        res.json({ result: 4 });
      } else {
        // 회원가입
        db.query(`insert into user (email, password, username, phone, verification,seq)  
        values ( "${email}", "${password}", "${username}", "${phone}", "${verify}", "${verification}" )`, (error, results) => {
          if(error){
            result = { result: 2 };
            res.json(results);
            console.log(`Error: 2 : ${error}`)
          } else {
            result = { result: 1 };
            res.json(result);
            console.log(`Success ! \n ${results}`)
          };
        });
      };
    });
  };
})

module.exports = router;