import Head from 'next/head'
import { FormEvent, useState } from 'react'
import { Layout } from '@/components/Layout'
import { useAuth } from '@/hooks/useAuth'

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '')
  const [saveMessage, setSaveMessage] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setAvatarUrl(result)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    updateProfile({ name, email, avatarUrl })
    setSaveMessage('Cambios aplicados')
    window.setTimeout(() => setSaveMessage(''), 3000)
  }

  return (
    <Layout>
      <Head>
        <title>Perfil · Biblioteca Digital Camilo Daza</title>
      </Head>

      <section className="page-panel">
        <h1>Perfil</h1>
        {!user ? (
          <div className="panel-card">
            <p>Inicia sesión para administrar tu perfil y tus datos personales.</p>
          </div>
        ) : (
          <div className="profile-page-grid">
            <div className="panel-card profile-summary">
              <div className="profile-avatar" style={{ backgroundImage: `url(${avatarUrl})` }} />
              <h2>{user.name}</h2>
              <p>{user.email}</p>
              <p style={{ fontSize: '0.9rem', color: 'var(--muted-color)' }}>ID: {user.documentId}</p>
              {user.role !== 'user' ? (
                <p style={{ fontSize: '0.9rem', color: 'var(--muted-color)' }}>
                  Categoría: {user.role === 'owner' ? 'Owner' : 'Administrador'}
                </p>
              ) : null}
            </div>

            <form className="profile-form" onSubmit={handleSubmit}>
              {saveMessage && <div className="success-message">{saveMessage}</div>}
              <label>
                Nombre completo
                <input value={name} onChange={(e) => setName(e.target.value)} />
              </label>
              <label>
                Correo electrónico / Documento
                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo electrónico o documento de identidad" />
              </label>
              <label>
                Subir foto de perfil
                <input type="file" accept="image/*" onChange={handleFileChange} />
              </label>
              <label>
                Cambiar contraseña
                <input type="password" placeholder="Nueva contraseña" />
              </label>
              <button className="primary-button" type="submit">Guardar cambios</button>
            </form>
          </div>
        )}
      </section>
    </Layout>
  )
}
