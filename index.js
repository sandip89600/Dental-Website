var express = require('express');
var mysql = require('mysql2');
require("dotenv").config();

var app = express();
var port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* ✅ CONNECTION POOL (IMPORTANT) */
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

/* Promise version (clean queries ke liye) */
const db = pool.promise();

/* 👉 GLOBAL use (routes me use kar sake) */
app.set("db", db);

/* Static + views */
app.use("/uploads", express.static("uploads")); 
app.use(express.static('public'));
app.set('view engine', 'ejs');

/* Routes */
var useRouter = require("./Routes/User");
var adminRouter = require("./Routes/admin");

app.use("/", useRouter);
app.use("/admin", adminRouter);

/* Server */
app.listen(port, function() {
    console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;