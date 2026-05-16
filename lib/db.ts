import Database from 'better-sqlite3'
import path from 'path'
import bcrypt from 'bcryptjs'

const dbPath = path.join(process.cwd(), 'data', 'biblioteca.db')

// Ensure data directory exists
import fs from 'fs'
const dataDir = path.dirname(dbPath)
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

const db = new Database(dbPath)

// Enable foreign keys
db.pragma('foreign_keys = ON')

export function initializeDatabase() {
  // Create users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      dni TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      apodo TEXT NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Check if admin user exists
  const adminExists = db.prepare('SELECT * FROM users WHERE dni = ?').get('1091979901')

  if (!adminExists) {
    const hashedPassword = bcrypt.hashSync('Yorman_13245F', 10)
    db.prepare(`
      INSERT INTO users (dni, email, apodo, password, role)
      VALUES (?, ?, ?, ?, ?)
    `).run('1091979901', 'fiayoyorman24@gmail.com', 'Administrador', hashedPassword, 'admin')

    console.log('✓ Admin user created')
  }
}

export function verifyCredentials(dniOrEmail: string, password: string) {
  const user = db
    .prepare('SELECT id, dni, email, apodo, password, role FROM users WHERE dni = ? OR email = ?')
    .get(dniOrEmail, dniOrEmail)

  if (!user) {
    return null
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password)

  if (!isPasswordValid) {
    return null
  }

  return {
    id: user.id,
    dni: user.dni,
    email: user.email,
    apodo: user.apodo,
    role: user.role,
  }
}

export function getUserById(id: number) {
  return db.prepare('SELECT id, dni, email, apodo, role FROM users WHERE id = ?').get(id)
}

export function updateUserPassword(userId: number, newPassword: string) {
  const hashedPassword = bcrypt.hashSync(newPassword, 10)
  const result = db
    .prepare('UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
    .run(hashedPassword, userId)

  return result.changes > 0
}

export function updateUserApodo(userId: number, newApodo: string) {
  const result = db
    .prepare('UPDATE users SET apodo = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
    .run(newApodo, userId)

  return result.changes > 0
}

export default db
