import Head from 'next/head'
import Link from 'next/link'
import { Layout } from '@/components/Layout'
import { useAuth } from '@/hooks/useAuth'
import { findBookById } from '@/utils/data'

interface HistoryBook {
  bookId: string
  title: string
  lastRead: string
}

export default function HistoryPage() {
  const { user, history } = useAuth()

  // Get unique books from history, sorted by most recent
  const historyBooks: HistoryBook[] = []
  const seenBookIds = new Set<string>()

  for (const activity of history) {
    if (activity.type === 'READ' && !seenBookIds.has(activity.subject)) {
      const book = books.find((b) => b.title === activity.subject)
      if (book) {
        historyBooks.push({
          bookId: book.id,
          title: book.title,
          lastRead: activity.timestamp,
        })
        seenBookIds.add(activity.subject)
      }
    }
  }

  // Sort by most recent
  historyBooks.sort((a, b) => new Date(b.lastRead).getTime() - new Date(a.lastRead).getTime())

  // Sort by most recent
  // (no inline search here; search lives in header and global /search page)

  return (
    <Layout>
      <Head>
        <title>Historial de lectura · Biblioteca Digital Camilo Daza</title>
      </Head>

      <section className="page-panel">
        <h1>Historial de lectura</h1>
        <p className="section-subtitle">Libros que has abierto o estás leyendo.</p>

        {!user ? (
          <div className="panel-card">
            <p>Por favor inicia sesión para ver tu historial personal.</p>
            <Link href="/login" className="primary-button" style={{ display: 'inline-block', marginTop: '1rem' }}>
              Iniciar sesión
            </Link>
          </div>
        ) : historyBooks.length === 0 ? (
          <div className="panel-card">
            <p>No hay historial todavía. Busca un libro o ábrelo para comenzar.</p>
          </div>
        ) : (
          <>
            <p style={{ color: 'var(--muted-color)', marginBottom: '1.5rem' }}>
              {historyBooks.length} {historyBooks.length === 1 ? 'libro' : 'libros'} en tu historial
            </p>
            <div className="books-cover-grid">
              {historyBooks.map((item) => {
                const book = findBookById(item.bookId)
                if (!book) return null
                return (
                  <Link key={item.bookId} href={`/book/${item.bookId}`} className="book-cover-item">
                    <img src={book.cover} alt={book.title} className="book-cover-image" />
                    <div className="book-cover-info">
                      <p className="book-cover-title">{book.title}</p>
                      <p className="book-cover-author">{book.author}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </>
        )}
      </section>
    </Layout>
  )
}
