const pool = require("./db");

async function testConnection() {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("Database Connected Successfully:", res.rows[0]);
  } catch (error) {
    console.error("Database Connection Error:", error);
  }
}

testConnection();
