import type { NextApiRequest, NextApiResponse } from 'next'
import { initializeDatabase, verifyCredentials } from '@/lib/db'

type ResponseData = {
  success?: boolean
  message?: string
  user?: {
    id: number
    dni: string
    email: string
    apodo: string
    role: string
  }
  error?: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  // Only allow POST
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    // Initialize database on first request
    initializeDatabase()

    const { dniOrEmail, password } = req.body

    // Validate input
    if (!dniOrEmail || !password) {
      res.status(400).json({ error: 'DNI/Email and password are required' })
      return
    }

    // Verify credentials
    const user = verifyCredentials(dniOrEmail, password)

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user,
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
