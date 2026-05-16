export interface SqlUserRecord {
  id: string
  name: string
  email: string
  password: string
  avatarUrl: string
}

export function createUsersTableSQL() {
  return `CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    email VARCHAR(256) NOT NULL UNIQUE,
    password VARCHAR(256) NOT NULL,
    avatar_url VARCHAR(512)
  );`
}

export function createPreferencesTableSQL() {
  return `CREATE TABLE IF NOT EXISTS preferencias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    book_id VARCHAR(64),
    search_term TEXT,
    category VARCHAR(128),
    author VARCHAR(128),
    genre VARCHAR(128),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );`
}

export function insertUserSQL(user: SqlUserRecord) {
  return `INSERT INTO users (id, name, email, password, avatar_url) VALUES ('${user.id}', '${user.name}', '${user.email}', '${user.password}', '${user.avatarUrl}');`
}

export function addUserToDatabase(user: SqlUserRecord) {
  return insertUserSQL(user)
}

export function logSearchSQL(userId: string, query: string) {
  return `INSERT INTO preferencias (user_id, search_term) VALUES ('${userId}', '${query.replace(/'/g, "''")}');`
}

export function logReadSQL(userId: string, bookId: string) {
  return `INSERT INTO preferencias (user_id, book_id) VALUES ('${userId}', '${bookId}');`
}

export function addBookSQL(bookId: string, title: string, author: string, category: string) {
  return `INSERT INTO libros (id, title, author, category) VALUES ('${bookId}', '${title.replace(/'/g, "''")}', '${author.replace(/'/g, "''")}', '${category.replace(/'/g, "''")}');`
}
