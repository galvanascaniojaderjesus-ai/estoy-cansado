const Database = require('better-sqlite3')
const path = require('path')
const fs = require('fs')
const bcrypt = require('bcryptjs')

const dataDir = path.join(process.cwd(), 'data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

const dbPath = path.join(dataDir, 'biblioteca.db')
const db = new Database(dbPath)

db.pragma('foreign_keys = ON')

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

const exists = db.prepare('SELECT 1 FROM users WHERE dni = ?').get('1091979901')
if (!exists) {
  const hashed = bcrypt.hashSync('Yorman_13245F', 10)
  db.prepare('INSERT INTO users (dni, email, apodo, password, role) VALUES (?, ?, ?, ?, ?)')
    .run('1091979901', 'fiayoyorman24@gmail.com', 'Administrador', hashed, 'admin')
  console.log('Admin usuario creado.')
} else {
  console.log('Admin usuario ya existe.')
}

db.close()
