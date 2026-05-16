import Head from 'next/head'
import Link from 'next/link'
import { Layout } from '@/components/Layout'
import { books } from '@/utils/data'

export default function Home() {
  // Sort books by popularity
  const popularBooks = [...books].sort((a, b) => b.popularity - a.popularity)
  const recommendedBooks = [...books].sort((a, b) => b.reads - a.reads)

  return (
    <Layout>
      <Head>
        <title>BIBLIOTECA DIGITAL CAMILO DAZA</title>
        <meta
          name="description"
          content="Biblioteca digital con catálogo de libros, recomendaciones personalizadas y soporte de PDF integrado."
        />
      </Head>

      <section className="hero-panel">
        <div>
          <span className="eyebrow">Inicio</span>
          <h1>Catálogo de libros, historial y recomendaciones personalizadas</h1>
          <p>Descubre libros, categorías, autores y tu historial de lectura en una biblioteca digital diseñada para ti.</p>
        </div>
      </section>

      <section className="section-panel">
        <div>
          <h2 style={{ marginBottom: '0.5rem' }}>Libros populares</h2>
          <p style={{ color: 'var(--muted-color)', marginBottom: '1.5rem' }}>
            Los títulos con más lecturas en nuestra plataforma.
          </p>
          <div className="books-cover-grid">
            {popularBooks.map((book) => (
              <Link key={book.id} href={`/book/${book.id}`} className="book-cover-item">
                <img src={book.cover} alt={book.title} className="book-cover-image" />
                <div className="book-cover-info">
                  <p className="book-cover-title">{book.title}</p>
                  <p className="book-cover-author">{book.author}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-panel">
        <div>
          <h2 style={{ marginBottom: '0.5rem' }}>Recomendados para ti</h2>
          <p style={{ color: 'var(--muted-color)', marginBottom: '1.5rem' }}>
            Basado en el interés de otros usuarios y tendencias.
          </p>
          <div className="books-cover-grid">
            {recommendedBooks.map((book) => (
              <Link key={book.id} href={`/book/${book.id}`} className="book-cover-item">
                <img src={book.cover} alt={book.title} className="book-cover-image" />
                <div className="book-cover-info">
                  <p className="book-cover-title">{book.title}</p>
                  <p className="book-cover-author">{book.author}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-panel">
        <div>
          <h2 style={{ marginBottom: '0.5rem' }}>Catálogo completo</h2>
          <p style={{ color: 'var(--muted-color)', marginBottom: '1.5rem' }}>
            {books.length} libros disponibles para leer.
          </p>
          <div className="books-cover-grid">
            {books.map((book) => (
              <Link key={book.id} href={`/book/${book.id}`} className="book-cover-item">
                <img src={book.cover} alt={book.title} className="book-cover-image" />
                <div className="book-cover-info">
                  <p className="book-cover-title">{book.title}</p>
                  <p className="book-cover-author">{book.author}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}
