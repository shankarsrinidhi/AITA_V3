const Pool = require("pg").Pool;


const pool = new Pool({
    user: "shankarsrinidhi",
    password: "M9P9iKP17U27$sT",
    host: "postgres-dvlp-1-db.c1ejzitv5n6q.us-east-1.rds.amazonaws.com",
    port: 5432,
    database: "dev_endeavors"
});


module.exports = pool;