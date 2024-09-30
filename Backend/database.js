const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const db = new sqlite3.Database(path.join(__dirname, "database.db"), (err) => {
  if (err) {
    console.error(err.message);
  }
});

db.serialize(() => {
  // Create User table with a unique name constraint
  db.run(`CREATE TABLE IF NOT EXISTS User (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  )`);

  // Create Address table with a unique constraint on user_id and address
  db.run(`CREATE TABLE IF NOT EXISTS Address (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    address TEXT NOT NULL,
    UNIQUE(user_id, address), 
    FOREIGN KEY (user_id) REFERENCES User(id)
  )`);
});

module.exports = db;
