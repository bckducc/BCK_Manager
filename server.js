const pool = require("./config/db");

async function testDB() {
    try {

        const connection = await pool.getConnection();

        console.log("✅ MySQL Connected");

        connection.release();

    } catch (error) {

        console.error("❌ MySQL Error:", error.message);

    }
}

testDB();