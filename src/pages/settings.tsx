import Head from 'next/head'
import { FormEvent, useState } from 'react'
import { Layout } from '@/components/Layout'
import { useTheme } from '@/hooks/useTheme'
import { useAuth } from '@/hooks/useAuth'

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme()
  const { user } = useAuth()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)

  const handleChangePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPasswordMessage('')
    setPasswordError('')

    if (newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden')
      return
    }

    if (newPassword.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setPasswordLoading(true)

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          currentPassword,
          newPassword,
          dniOrEmail: user?.email || user?.documentId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setPasswordError(data.error || 'Error al cambiar la contraseña')
      } else {
        setPasswordMessage('Cambios aplicados')
        setPasswordError('')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      }
    } catch (error) {
      setPasswordError('Error al conectar con el servidor')
      console.error('Change password error:', error)
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <Layout>
      <Head>
        <title>Ajustes · Biblioteca Digital Camilo Daza</title>
      </Head>

      <section className="page-panel">
        <h1>Ajustes</h1>
        
        {/* Tema de visualización */}
        <p className="section-subtitle">Configura el tema y el estilo de tu experiencia de lectura.</p>
        <div className="panel-card settings-card">
          <div className="settings-row">
            <div>
              <h2>Tema de visualización</h2>
              <p>Activa el modo oscuro para cambiar los colores del sitio a tonos grises y acentos fosforescentes.</p>
            </div>
            <button className="secondary-button" onClick={toggleTheme} type="button">
              Cambiar a {theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
            </button>
          </div>
          <div className="theme-preview">
            <span>{theme === 'light' ? 'Tema claro activo' : 'Tema oscuro activo'}</span>
          </div>
        </div>

        {/* Cambio de contraseña */}
        {user && (
          <>
            <p className="section-subtitle" style={{ marginTop: '2rem' }}>Seguridad de tu cuenta</p>
            <div className="panel-card settings-card">
              <h2>Cambiar contraseña</h2>
              <p>Actualiza tu contraseña regularmente para mantener tu cuenta segura.</p>

              {passwordError && <div className="error-message">{passwordError}</div>}
              {passwordMessage && <div className="success-message">{passwordMessage}</div>}

              <form onSubmit={handleChangePassword} className="auth-form">
                <label>
                  Contraseña actual
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="ingresa tu contraseña actual"
                    disabled={passwordLoading}
                    required
                  />
                </label>
                <label>
                  Nueva contraseña
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="ingresa tu nueva contraseña"
                    disabled={passwordLoading}
                    required
                  />
                </label>
                <label>
                  Confirmar contraseña
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="confirma tu nueva contraseña"
                    disabled={passwordLoading}
                    required
                  />
                </label>
                <button className="primary-button" type="submit" disabled={passwordLoading}>
                  {passwordLoading ? 'Actualizando...' : 'Cambiar contraseña'}
                </button>
              </form>
            </div>
          </>
        )}
      </section>
    </Layout>
  )
}
