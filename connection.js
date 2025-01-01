var mysql=require('mysql');

var conn=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'backendmodule',
    port:'3306'
})

conn.connect((err,data)=>{
    console.log(err);
    console.log(data);
})

// promised based exeution
var util=require('util');
var exe=util.promisify(conn.query).bind(conn);

module.exports=exe;