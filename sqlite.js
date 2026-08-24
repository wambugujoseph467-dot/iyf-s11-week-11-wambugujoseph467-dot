const Database = require("better-sqlite3");

const db = new Database("communityhub.db");

console.log("SQLite database connected");

// Create posts table
db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY,
    author TEXT NOT NULL,
    title TEXT NOT NULL,
    likes INTEGER DEFAULT 0
  );
`);

// Clear existing data so we don't create duplicates when running again
db.exec("DELETE FROM posts");

// Insert posts
const insertPost = db.prepare(`
  INSERT INTO posts (author, title, likes)
  VALUES (?, ?, ?)
`);

insertPost.run("maisori", "Hello SQL", 3);
insertPost.run("amina", "Joins are fun", 7);
insertPost.run("maisori", "Second post", 1);

console.log("\n--- All posts ordered by likes ---");

const popularPosts = db.prepare(`
  SELECT * FROM posts
  ORDER BY likes DESC
`).all();

console.table(popularPosts);

console.log("\n--- Posts by maisori ---");

const authorPosts = db.prepare(`
  SELECT * FROM posts
  WHERE author = ?
`).all("maisori");

console.table(authorPosts);

// Create users table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT NOT NULL
  );
`);

// Clear existing users
db.exec("DELETE FROM users");

// Insert users
const insertUser = db.prepare(`
  INSERT INTO users (username, email)
  VALUES (?, ?)
`);

insertUser.run("maisori", "maisori@example.com");
insertUser.run("amina", "amina@example.com");

// JOIN posts with users
console.log("\n--- Posts with user information ---");

const joinedPosts = db.prepare(`
  SELECT
    posts.id,
    users.username,
    users.email,
    posts.title,
    posts.likes
  FROM posts
  JOIN users
    ON posts.author = users.username
`).all();

console.table(joinedPosts);

db.close();

console.log("\nSQLite exercise completed successfully!");