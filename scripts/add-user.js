#!/usr/bin/env node

const Database = require('better-sqlite3')
const bcrypt = require('bcryptjs')
const path = require('path')
const readline = require('readline')

const dbPath = path.join(process.cwd(), 'data', 'biblioteca.db')
const db = new Database(dbPath)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer)
    })
  })
}

async function main() {
  console.log('\n📝 Agregar Nuevo Usuario\n')

  try {
    const dni = await question('📌 DNI (min 5 dígitos): ')
    if (!/^\d{5,}$/.test(dni)) {
      console.error('❌ DNI inválido. Debe tener al menos 5 dígitos.\n')
      rl.close()
      return
    }

    const email = await question('📧 Email: ')
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.error('❌ Email inválido.\n')
      rl.close()
      return
    }

    const apodo = await question('👤 Nombre/Apodo: ')
    if (!apodo.trim()) {
      console.error('❌ El nombre no puede estar vacío.\n')
      rl.close()
      return
    }

    const password = await question('🔒 Contraseña (min 6 caracteres): ')
    if (password.length < 6) {
      console.error('❌ La contraseña debe tener al menos 6 caracteres.\n')
      rl.close()
      return
    }

    const roleInput = await question('🎭 Rol (user/admin/owner) [default: user]: ')
    const validRoles = ['user', 'admin', 'owner']
    const role = validRoles.includes(roleInput.toLowerCase()) ? roleInput.toLowerCase() : 'user'

    // Check if DNI or email already exists
    const existing = db.prepare('SELECT * FROM users WHERE dni = ? OR email = ?').get(dni, email)
    if (existing) {
      console.error('❌ El DNI o email ya está registrado.\n')
      rl.close()
      return
    }

    // Create user
    const hashedPassword = bcrypt.hashSync(password, 10)
    const result = db
      .prepare(`
        INSERT INTO users (dni, email, apodo, password, role)
        VALUES (?, ?, ?, ?, ?)
      `)
      .run(dni, email, apodo, hashedPassword, role)

    console.log('\n✅ Usuario creado exitosamente!\n')
    console.log('📋 Datos:')
    console.log(`   ID: ${result.lastInsertRowid}`)
    console.log(`   DNI: ${dni}`)
    console.log(`   Email: ${email}`)
    console.log(`   Nombre: ${apodo}`)
    console.log(`   Rol: ${role === 'owner' ? '👑 Owner' : role === 'admin' ? '⚙️  Admin' : '👤 Usuario'}\n`)
  } catch (error) {
    console.error('❌ Error:', error.message, '\n')
  } finally {
    rl.close()
    db.close()
  }
}

main()
