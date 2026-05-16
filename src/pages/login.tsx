import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FormEvent, useState } from 'react'
import { Layout } from '@/components/Layout'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
  const { setUser } = useAuth()
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const getSavedAvatar = (email: string, documentId: string) => {
    if (typeof window === 'undefined') return ''
    try {
      const raw = window.localStorage.getItem('biblioteca-user-profiles')
      if (!raw) return ''
      const profiles = JSON.parse(raw) as Record<string, { avatarUrl?: string }>
      return profiles[email]?.avatarUrl || profiles[documentId]?.avatarUrl || ''
    } catch {
      return ''
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Call login API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dniOrEmail: email,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Login failed')
        setLoading(false)
        return
      }

      // Save user to context and localStorage
      if (data.user) {
        const savedAvatar = getSavedAvatar(data.user.email || '', data.user.dni || '')
        const userData = {
          id: data.user.id.toString(),
          name: name || data.user.apodo || 'Usuario',
          email: data.user.email,
          documentId: data.user.dni,
          avatarUrl:
            savedAvatar || data.user.avatarUrl || data.user.avatar_url || `/avatar-${Math.floor(Math.random() * 6) + 1}.png`,
          role: (data.user.role === 'owner' ? 'owner' : data.user.role === 'admin' ? 'admin' : 'user') as 'owner' | 'admin' | 'user',
        }

        // Update user in context (this also saves to localStorage)
        setUser(userData)

        // Redirect to home
        router.push('/')
      }
    } catch (err) {
      setError('Error al conectar con el servidor')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <Head>
        <title>Iniciar sesión · Biblioteca Digital Camilo Daza</title>
      </Head>

      <section className="page-panel">
        <div className="panel-card">
          <h1>Iniciar sesión</h1>
          <p>Accede a tu perfil y guarda tu historial de lectura.</p>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <label>
              Apodo
              <input 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="ingresa como quieres que te llamen"
                disabled={loading}
              />
            </label>
            <label>
              Nº. de Identificación / Email
              <input 
                type="text" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="ingrese su correo o DNI"
                disabled={loading}
                required
              />
            </label>
            <label>
              contraseña
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="contraseña"
                disabled={loading}
                required
              />
            </label>
            <button className="primary-button" type="submit" disabled={loading}>
              {loading ? 'Verificando...' : 'Entrar'}
            </button>
          </form>
          <p className="note">
            Los datos de inicio de sesión se registrarán y podrán ser usados para recomendaciones.
          </p>
        </div>
      </section>
    </Layout>
  )
}
