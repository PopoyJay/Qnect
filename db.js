const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",  // Ensure this matches your PostgreSQL user
  host: "localhost",
  database: "Qnect", // Ensure this database exists
  password: "Sugar021498**", // Ensure this matches your database password
  port: 5432,  // Default PostgreSQL port
});

pool.on("connect", () => {
  console.log("✅ Connected to PostgreSQL database!");
});

// Add error logging
pool.on("error", (err) => {
  console.error("❌ Database connection error:", err);
});

module.exports = pool;
