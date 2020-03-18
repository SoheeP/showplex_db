# SHOWPLEX DB

포트폴리오용 페이지 Showplex의 백엔드 서버입니다.

##### USED 

* Node.js
* Express-session
* MySql

### Getting Start

이 서버를 로컬에서 구동하여 확인하시려면 아래 내용을 따라 진행해주시면 됩니다.

##### 시작전 필수 사항

1. MySql이 설치되어 있어야 합니다.
2. Node.js 가 설치되어 있어야 합니다.
3. Git bash가 설치되어 있어야 합니다.
4. 뮤지컬, 연극 정보는 KOPIS의 오픈 API를 사용하였으며, 정보를 받아오기 위해서는 관련 API 키가 입력된 `apiKey.js` 파일이 필요합니다. 
   * [KOPIS에서 발급받은 인증키가 있어야 합니다.](http://www.kopis.or.kr/por/cs/openapi/openApiInfo.do?menuId=MNU_00074)

##### 설치방법

1. Git bash에서 아래 repo를 클론합니다.

   ```bash
   $ git clone https://github.com/SoheeP/showplex.git
   ```

2. Npm을 이용하여 필요한 모듈을 설치합니다.

   ```bash
   $ npm i
   ```

3. MySql에서 쿼리문을 실행합니다. &rarr; [쿼리문 이동](https://github.com/SoheeP/showplex_db/blob/master/query/showplex.sql)

4. KOPIS API키가 있다면, `/routes/database/`경로에 `apiKey.js`를 생성하고, 파일 내에 아래와 같은 코드를 입력합니다.

   ```js
   let KEY = '키값';
   
   exports.KEY = KEY;
   ```

   

5. 모두 완료되었다면 `npm start`로 로컬서버를 실행합니다.

   ```bash
   $ npm start
   ```

   

### Router

##### index

* 영화, 연극, 뮤지컬 API로 요청을 보낸 후 응답데이터를 받아옵니다.
* 리스트 정보, 상세 정보를 받아옵니다.

##### auth

* 회원가입, 로그인, 회월탈퇴를 처리합니다.
* 로그인 시 IP기록은 임의 IP로, 실제 IP를 수집하지 않습니다.

##### board

* 자유게시판 리스트, 글쓰기, 삭제, 수정을 처리합니다.

##### users

* 로그인 시 로그인한 기록 조회, 회원정보 수정을 처리합니다.