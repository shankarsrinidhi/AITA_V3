const Pool = require("pg").Pool;
const fs = require("fs");

let db;

// initialize databse for local development
if (process.env.NODE_ENV === 'development') {
    db = new Pool({
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        host: "db",
        port: 5432,
        database: process.env.POSTGRES_DB
    });
    
    const dataSql = fs.readFileSync('./dbcreate.sql').toString();
    const dataArr = dataSql.toString().split(');');

    dataArr.forEach((entry) => {
        try {
            db.query(entry)
        } catch(err) {
            console.error(err.message);
        }
    })

    try {
        db.query(entry)
    } catch(err) {
        console.error(err.message);
    }

    // default admin instructor setup
    let instructor_id = "904473820"
    let email = "cckovach@vt.edu"
    let first_name = "Chris"
    let last_name = "Kovach"
    let is_admin = true
    // db.query("INSERT INTO instructor (instructor_id, email, first_name, last_name, is_admin) VALUES($1,$2,$3,$4,$5) RETURNING *",[instructor_id,email,first_name,last_name,is_admin]);
}

// just use credentials for production - db is already initialized
if (process.send.NODE_ENV === 'production') {
    db = new Pool({
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        host: process.env.DB_HOSTNAME,
        port: process.env.DB_PORT,
        database: process.env.POSTGRES_DB
    });
}

const pool = db

module.exports = pool;