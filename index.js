var express = require('express');
var mysql = require('mysql2');
var app = express();
var port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const connection = mysql.createConnection({
    host: 'localhost', 
    user: 'root',
    password: 'password',
    database: 'school'
});
app.use("/uploads", express.static("uploads")); 
app.use(express.static('public'));
app.set('view engine', 'ejs');

var useRouter = require("./Routes/User");
var adminRouter = require("./Routes/admin");

app.use("/",useRouter);
app.use("/admin",adminRouter);
 
app.listen(port, function() {
    console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;   