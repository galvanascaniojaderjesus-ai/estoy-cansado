import type { NextApiRequest, NextApiResponse } from 'next'
import { getAllUsers, getUserById } from '@/lib/db'

interface ResponseData {
  users?: any[]
  error?: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const userId = req.headers['x-user-id'] as string

    if (!userId) {
      return res.status(401).json({ error: 'No autorizado' })
    }

    // Verify user is admin or owner
    const authUser = getUserById(parseInt(userId))
    if (!authUser || (authUser.role !== 'admin' && authUser.role !== 'owner')) {
      return res.status(403).json({ error: 'No tienes permiso' })
    }

    const users = getAllUsers()
    return res.status(200).json({ users })
  } catch (error) {
    console.error('Get users error:', error)
    return res.status(500).json({ error: 'Error al obtener usuarios' })
  }
}
