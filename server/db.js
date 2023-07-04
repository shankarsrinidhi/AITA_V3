const Pool = require("pg").Pool;


const pool = new Pool({
    user: "postgres",
    password: "Malavika@95",
    host: "localhost",
    port: 5432,
    database: "AITA_V1"
});


module.exports = pool;
