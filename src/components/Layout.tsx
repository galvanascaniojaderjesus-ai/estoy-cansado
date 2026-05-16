import Link from 'next/link'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'
import { books } from '@/utils/data'

interface LayoutProps {
  children: React.ReactNode
}

function getInitials(name?: string) {
  const safeName = (name || 'Usuario').trim()
  return safeName
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0].toUpperCase())
    .slice(0, 2)
    .join('') || 'US'
}

function getAvatarFallback(name?: string) {
  const initials = getInitials(name)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#22c55e"/><text x="50" y="55" font-family="Inter, sans-serif" font-size="40" fill="#ffffff" font-weight="700" text-anchor="middle" dominant-baseline="middle">${initials}</text></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const avatarSrc = user?.avatarUrl?.trim() ? user.avatarUrl : user ? getAvatarFallback(user.name) : null

  const normalizedSearch = searchTerm.trim().toLowerCase()
  const suggestions = useMemo(() => {
    if (!normalizedSearch) return []
    const matchedBooks = books.filter((book) => book.title.toLowerCase().includes(normalizedSearch))
    const matchedAuthors = books.filter((book) => book.author.toLowerCase().includes(normalizedSearch))
    const combined = [...matchedBooks, ...matchedAuthors]
    const unique = combined.reduce<Record<string, typeof books[0]>>((acc, book) => {
      acc[book.id] = book
      return acc
    }, {})
    return Object.values(unique).slice(0, 6)
  }, [normalizedSearch])

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="header-left">
          {user ? (
            <Link href="/profile" className="header-user">
              {avatarSrc && <img src={avatarSrc} alt={user.name} className="header-avatar" />}
              <span>
                Hola, {user.name}
                {user.role !== 'user' ? (
                  <small className={`header-role header-role-${user.role}`}>
                    {user.role === 'owner' ? 'Owner' : 'Administrador'}
                  </small>
                ) : null}
              </span>
            </Link>
          ) : (
            <span className="header-user placeholder">Hola, invitado</span>
          )}
          <div className="logo-group">
            <img src="/logos/logo1.png" alt="Biblioteca Digital Camilo Daza" className="site-logo" />
            <div>
              <span className="logo-pill">BIBLIOTECA</span>
              <span className="library-name">
                <span className="library-digital">DIGITAL</span>
                <span className="library-camilo">CAMILO DAZA</span>
              </span>
            </div>
          </div>
        </div>

        <nav className="site-nav">
          <Link href="/">Inicio</Link>
          <Link href="/categorias">Categorías</Link>
          <Link href="/autores">Autores</Link>
          <Link href="/historial">Historial</Link>
        </nav>

        

        <div className="header-right">
          <button className="profile-button" onClick={() => setMenuOpen((prev) => !prev)}>
            <span />
            <span />
            <span />
          </button>
          {menuOpen && (
            <div className="profile-menu">
              <div className="profile-menu-section">
                {user ? null : <Link href="/login">Iniciar sesión</Link>}
                <Link href="/settings">Ajustes</Link>
                <Link href="/preferences">Preferencias</Link>
                {user && (user.role === 'admin' || user.role === 'owner') && (
                  <Link href="/admin/users">Gestionar Usuarios</Link>
                )}
              </div>

              <div className="profile-menu-section">
                {user && (
                  <button className="logout-button" onClick={logout} type="button">
                    Cerrar sesión
                  </button>
                )}
                <button className="theme-toggle" onClick={toggleTheme} type="button">
                  Tema: {theme === 'light' ? 'Claro' : 'Oscuro'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Search placed below the three-line profile button as requested */}
        <div className="site-search-below">
          <span className="search-label">Buscar</span>
          <label className="site-search-label" htmlFor="header-search">
            <input
              id="header-search"
              type="search"
              className="site-search-input"
              placeholder="Buscar título o autor"
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value)
                setShowSuggestions(true)
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  const trimmed = searchTerm.trim()
                  if (!trimmed) return
                  router.push({ pathname: '/search', query: { search: trimmed } })
                }
              }}
              inputMode="search"
              enterKeyHint="search"
            />
          </label>
          {showSuggestions && suggestions.length > 0 && (
            <div className="search-suggestions">
              {suggestions.map((book) => (
                <Link
                  key={book.id}
                  href={`/book/${book.id}`}
                  className="suggestion-item"
                  onClick={() => setShowSuggestions(false)}
                >
                  <strong>{book.title}</strong>
                  <span>{book.author}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="site-main">{children}</main>

      <footer className="site-footer">
        <p>Biblioteca Digital Camilo Daza · Catálogo de libros y recomendaciones inteligentes</p>
      </footer>
    </div>
  )
}
