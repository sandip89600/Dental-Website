var mysql = require('mysql');
var util = require('util');


var con= mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"school"
})


var exe = util.promisify(con.query).bind(con)

module.exports = exe;

