var express = require('express');
var router = express.Router();
var _ = require('lodash');
var axios = require('axios');
const { db, query } = require('./database/mysql');

const moment = require('moment');
const geoip = require('geoip-lite');


router.route('/signup')
.post(async (req, res, next) => {

  const email  = req.body.email,
  password     = req.body.password,
  username     = req.body.username,
  phone        = req.body.phone,
  verifyNumber = req.body.captcha;
  // capcha로 우선 설정
  let verify, result;
  console.log(email, password, username, phone, verifyNumber);
  /** 
   * NOTE: result 값 
   * 1: 가입 완료
   * 2: 무엇인가의 에러로 인한 실패
   * 3: 인증 실패
   * 4: 중복 체크
   * */ 
  if(verifyNumber.length === 0){
    result = { result: 3 };
    res.json(result)
  } else {
    verify = 1;
    db.query(`select * from showplex.user where email="${email}"`, (err, results) => {
      if(err) throw err;
      console.log(results, 'BACK:: Result');
      if(results.length > 0 ){
        res.json({ result: 4 });
      } else {
        // 회원가입
        db.query(`insert into showplex.user (email, password, username, phone, verifyNumber, verify) values ("${email}", "${password}", "${username}", "${phone}", "${verifyNumber}", "${verify}")`, (error, results) => {
          if(error){
            result = { result: 2 };
            res.json(result);
            console.log(`Error: 2 : ${error}, ${results}`);
          } else {
            result = { result: 1 };
            res.json(result);
            console.log(`Success ! ${results}`);
          };
        });
      };
    });
  };
});

router.route('/signin')
.post(async (req, res, next) => {
  
  const email = req.body.email,
  password    = req.body.password;

  /** NOTE: result 값
   * 1: 로그인 성공 및 로그 기록
   * 2: 로그인 실패
   */

  db.query(`select * from showplex.user where email="${email}" and password="${password}"`, async (error, results) => {
    if(error) throw error;
    let result_data;
    // 반환결과가 있을 때
    if(results.length > 0){
      result_data = _.omit(results[0], ['password', 'verifyNumber']);
      result_data.result = 1;
      let ip = '207.97.227.239'; // 가상
      let geo = geoip.lookup(ip);
      // express-device 사용
      let device = req.device.type.toUpperCase();
      let nowTime = moment().format('YYYY/MM/DD hh:mm:ss');
      let userSeq = result_data.usernum;
      query(`insert into showplex.log (usernum, country, loginTime, ip, device) values ("${userSeq}", "${geo.country}", "${nowTime}", "${ip}", "${device}")`);
      res.json(result_data);
    } else {
      result_data = { result: 2 };
      res.json(result_data);
    };
  })
})

module.exports = router;