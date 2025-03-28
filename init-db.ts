const { getDb } = require("./src/database");

async function initDb() {
  try {
    const db = await getDb();
    console.log("Database initialized successfully!");
    await db.close();
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}

initDb();