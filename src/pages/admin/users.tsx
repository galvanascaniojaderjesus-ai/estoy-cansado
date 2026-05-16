'use client'

import { FormEvent, useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Layout } from '@/components/Layout'
import { useAuth } from '@/hooks/useAuth'
import styles from '@/styles/Home.module.css'

interface User {
  id: number
  dni: string
  email: string
  apodo: string
  role: string
  created_at: string
}

export default function AdminUsersPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formLoading, setFormLoading] = useState(false)

  const [formData, setFormData] = useState({
    dni: '',
    email: '',
    apodo: '',
    password: '',
    role: 'user',
  })

  useEffect(() => {
    // Check if user is admin or owner
    if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
      router.push('/')
      return
    }

    // Fetch users list
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/users', {
          headers: {
            'X-User-ID': user.id,
          },
        })

        if (!response.ok) {
          setError('Error al cargar usuarios')
          return
        }

        const data = await response.json()
        setUsers(data.users || [])
      } catch (err) {
        setError('Error al conectar con el servidor')
        console.error('Fetch users error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [user, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setFormLoading(true)

    try {
      const response = await fetch('/api/auth/register-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          ...formData,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Error al crear usuario')
        return
      }

      setSuccess('Usuario creado exitosamente')
      setUsers((prev) => [
        {
          id: data.user.id,
          dni: data.user.dni,
          email: data.user.email,
          apodo: data.user.apodo,
          role: data.user.role,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ])

      // Reset form
      setFormData({ dni: '', email: '', apodo: '', password: '', role: 'user' })
      setShowForm(false)
    } catch (err) {
      setError('Error al conectar con el servidor')
      console.error('Register error:', err)
    } finally {
      setFormLoading(false)
    }
  }

  if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
    return null
  }

  return (
    <Layout>
      <Head>
        <title>Gestionar Usuarios · Biblioteca Digital</title>
      </Head>

      <section className="page-panel">
        <div className="panel-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h1>Gestionar Usuarios</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: showForm ? '#ef4444' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              {showForm ? 'Cancelar' : 'Nuevo Usuario'}
            </button>
          </div>

          {error && (
            <div
              style={{
                padding: '0.75rem',
                backgroundColor: '#fee2e2',
                color: '#991b1b',
                borderRadius: '0.375rem',
                marginBottom: '1rem',
              }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              style={{
                padding: '0.75rem',
                backgroundColor: '#dcfce7',
                color: '#166534',
                borderRadius: '0.375rem',
                marginBottom: '1rem',
              }}
            >
              {success}
            </div>
          )}

          {showForm && (
            <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #e5e7eb' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label htmlFor="dni">DNI *</label>
                  <input
                    id="dni"
                    type="text"
                    name="dni"
                    value={formData.dni}
                    onChange={handleInputChange}
                    placeholder="Ej: 1234567890"
                    required
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}
                  />
                </div>
                <div>
                  <label htmlFor="email">Email *</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="usuario@ejemplo.com"
                    required
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}
                  />
                </div>
                <div>
                  <label htmlFor="apodo">Nombre/Apodo *</label>
                  <input
                    id="apodo"
                    type="text"
                    name="apodo"
                    value={formData.apodo}
                    onChange={handleInputChange}
                    placeholder="Nombre del usuario"
                    required
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}
                  />
                </div>
                <div>
                  <label htmlFor="password">Contraseña *</label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Min. 6 caracteres"
                    required
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}
                  />
                </div>
                <div>
                  <label htmlFor="role">Rol</label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}
                  >
                    <option value="user">Usuario Normal</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={formLoading}
                style={{
                  padding: '0.5rem 1.5rem',
                  backgroundColor: formLoading ? '#9ca3af' : '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: formLoading ? 'not-allowed' : 'pointer',
                  fontSize: '0.875rem',
                }}
              >
                {formLoading ? 'Creando...' : 'Crear Usuario'}
              </button>
            </form>
          )}

          <h2>Usuarios Registrados ({users.length})</h2>

          {loading ? (
            <p>Cargando usuarios...</p>
          ) : users.length === 0 ? (
            <p style={{ color: '#6b7280' }}>No hay usuarios registrados</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <style>{`
                .users-table tbody tr:hover {
                  background-color: #f9fafb;
                }
              `}</style>
              <table style={{ width: '100%', borderCollapse: 'collapse' }} className="users-table">
                <thead>
                  <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600' }}>
                      DNI
                    </th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600' }}>
                      Email
                    </th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600' }}>
                      Nombre
                    </th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600' }}>
                      Rol
                    </th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600' }}>
                      Creado
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '0.75rem' }}>
                        <code style={{ fontSize: '0.875rem', backgroundColor: '#f3f4f6', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>
                          {u.dni}
                        </code>
                      </td>
                      <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>{u.email}</td>
                      <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>{u.apodo}</td>
                      <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.25rem',
                            backgroundColor: u.role === 'admin' ? '#fef3c7' : u.role === 'owner' ? '#fcd34d' : '#e5e7eb',
                            color: u.role === 'admin' ? '#92400e' : u.role === 'owner' ? '#a16207' : '#374151',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                          }}
                        >
                          {u.role === 'owner' ? 'Owner' : u.role === 'admin' ? 'Admin' : 'Usuario'}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#6b7280' }}>
                        {new Date(u.created_at).toLocaleDateString('es-ES')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </Layout>
  )
}
