const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "app",
    password: "admin",
    port: 5432,
});

pool
  .connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((error) => console.error("Failed", error));

module.exports = pool