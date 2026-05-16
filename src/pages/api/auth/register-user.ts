import type { NextApiRequest, NextApiResponse } from 'next'
import { createUser, getUserById } from '@/lib/db'

interface ResponseData {
  success?: boolean
  message?: string
  user?: any
  error?: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { userId, dni, email, apodo, password, role } = req.body

    // Validate required fields
    if (!userId || !dni || !email || !apodo || !password) {
      return res.status(400).json({ error: 'Faltan campos requeridos' })
    }

    // Verify user is admin or owner
    const authUser = getUserById(parseInt(userId))
    if (!authUser || (authUser.role !== 'admin' && authUser.role !== 'owner')) {
      return res.status(403).json({ error: 'No tienes permiso para crear usuarios' })
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'El email no es válido' })
    }

    // Validate DNI (at least 5 digits)
    if (!/^\d{5,}$/.test(dni)) {
      return res.status(400).json({ error: 'El DNI debe contener al menos 5 dígitos' })
    }

    // Create user
    const userRole = role === 'admin' || role === 'owner' ? role : 'user'
    const result = createUser(dni, email, apodo, password, userRole)

    if (!result.success) {
      return res.status(400).json({ error: result.error })
    }

    return res.status(201).json({
      success: true,
      message: result.message,
      user: {
        id: result.id,
        dni,
        email,
        apodo,
        role: userRole,
      },
    })
  } catch (error) {
    console.error('Register user error:', error)
    return res.status(500).json({ error: 'Error al crear usuario' })
  }
}
