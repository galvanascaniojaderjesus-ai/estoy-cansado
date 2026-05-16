import Head from 'next/head'
import { Layout } from '@/components/Layout'
import { useMemo, useState } from 'react'
import { authors, books } from '@/utils/data'

function getInitials(name?: string) {
  const safeName = (name || 'Autor').trim()
  return safeName
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0].toUpperCase())
    .slice(0, 2)
    .join('')
}

export default function AuthorsPage() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const booksByAuthor = useMemo(() => {
    return books.reduce<Record<string, typeof books>>((acc, book) => {
      acc[book.author] ??= []
      acc[book.author].push(book)
      return acc
    }, {})
  }, [])

  function toggleAuthor(name: string) {
    setExpanded((prev) => ({ ...prev, [name]: !prev[name] }))
  }

  return (
    <Layout>
      <Head>
        <title>Autores · Biblioteca Digital Camilo Daza</title>
      </Head>

      <section className="page-panel">
        <h1>Autores</h1>
        <p className="section-subtitle">Explora los autores disponibles en la base de datos.</p>
        <div className="info-grid">
          {authors.map((author) => {
            const isOpen = !!expanded[author.name]
            const authorBooks = booksByAuthor[author.name] || []
            return (
              <article key={author.name} className="author-card">
                <div className="author-header" onClick={() => toggleAuthor(author.name)} role="button">
                  {author.image ? (
                    <img src={author.image} alt={author.name} className="author-image" />
                  ) : (
                    <div className="author-avatar">{getInitials(author.name)}</div>
                  )}

                  <div className="author-meta">
                    <h2>{author.name}</h2>
                    <p>{author.bio}</p>
                  </div>

                  <div className="author-toggle">{isOpen ? 'Ocultar libros' : `Ver ${authorBooks.length} libro(s)`}</div>
                </div>

                {isOpen && (
                  <div className="author-books">
                    {authorBooks.length === 0 ? (
                      <p style={{ color: 'var(--muted-color)' }}>No hay libros disponibles para este autor.</p>
                    ) : (
                      <div className="books-cover-grid">
                        {authorBooks.map((book) => (
                          <a key={book.id} href={`/book/${book.id}`} className="book-cover-item">
                            <img src={book.cover} alt={book.title} className="book-cover-image" />
                            <div className="book-cover-info">
                              <p className="book-cover-title">{book.title}</p>
                              <p className="book-cover-author">{book.author}</p>
                            </div>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </section>
    </Layout>
  )
}