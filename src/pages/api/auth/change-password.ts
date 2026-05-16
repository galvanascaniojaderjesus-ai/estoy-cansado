import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyCredentials, updateUserPassword } from '@/lib/db'

type ResponseData = {
  success?: boolean
  message?: string
  error?: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const { userId, currentPassword, newPassword, dniOrEmail } = req.body

    if (!userId || !currentPassword || !newPassword) {
      res.status(400).json({ error: 'Missing required fields' })
      return
    }

    // Verify current password (requires dniOrEmail for verification)
    if (!dniOrEmail) {
      res.status(400).json({ error: 'DNI or email required for verification' })
      return
    }

    const user = verifyCredentials(dniOrEmail, currentPassword)

    if (!user) {
      res.status(401).json({ error: 'Current password is incorrect' })
      return
    }

    // Update password
    const updated = updateUserPassword(userId, newPassword)

    if (updated) {
      res.status(200).json({
        success: true,
        message: 'Password updated successfully',
      })
    } else {
      res.status(500).json({ error: 'Failed to update password' })
    }
  } catch (error) {
    console.error('Change password error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
