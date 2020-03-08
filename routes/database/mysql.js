var mysql = require('mysql');

// db config
var db = mysql.createConnection({
  host: 'localhost',
  user: "root",
  password: "root",
  port: 3306,
  database: "showplex",
  insecureAuth : true
});
db.connect();

function query(queryState, callback = ()=>{}){
  db.query(queryState,(err,rows)=>{
    if(err) throw err;
    let result = JSON.parse(JSON.stringify(rows));
    callback(result)
  })
}



exports.db = db;
exports.query = query;