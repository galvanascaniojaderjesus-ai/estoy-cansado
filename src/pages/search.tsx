import Head from 'next/head'
import Link from 'next/link'
import { useMemo } from 'react'
import { useRouter } from 'next/router'
import { Layout } from '@/components/Layout'
import { books, categories } from '@/utils/data'

export default function SearchPage() {
  const router = useRouter()
  const query = typeof router.query.search === 'string' ? router.query.search.trim() : ''
  const normalizedQuery = query.toLowerCase()

  const filteredBooks = useMemo(
    () =>
      query
        ? books.filter(
            (book) =>
              book.title.toLowerCase().includes(normalizedQuery) ||
              book.author.toLowerCase().includes(normalizedQuery),
          )
        : [],
    [normalizedQuery, query],
  )

  const booksByCategory = useMemo(() => {
    return filteredBooks.reduce<Record<string, typeof books>>((acc, book) => {
      const key = book.category
      if (!acc[key]) acc[key] = []
      acc[key].push(book)
      return acc
    }, {})
  }, [filteredBooks])

  const categoriesWithResults = categories.filter((category) => booksByCategory[category.name]?.length)

  return (
    <Layout>
      <Head>
        <title>Buscar · Biblioteca Digital Camilo Daza</title>
      </Head>

      <section className="page-panel">
        <h1>Búsqueda</h1>
        <p className="section-subtitle">Encuentra libros por título o autor desde la barra superior.</p>

        {query.length === 0 ? (
          <div className="panel-card">
            <p>Escribe un título o autor en la barra de búsqueda de la cabecera para ver resultados.</p>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="panel-card">
            <p>No se encontraron libros que coincidan con <strong>{query}</strong>.</p>
          </div>
        ) : (
          <>
            <p style={{ color: 'var(--muted-color)', marginBottom: '1rem' }}>
              {filteredBooks.length} {filteredBooks.length === 1 ? 'resultado' : 'resultados'} para <strong>{query}</strong>
            </p>
            {categoriesWithResults.map((category) => (
              <div key={category.name} className="category-block">
                <div className="category-header">
                  <h2>{category.name}</h2>
                  <p className="category-description">{category.description}</p>
                </div>
                <div className="books-cover-grid">
                  {booksByCategory[category.name].map((book) => (
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
            ))}
          </>
        )}
      </section>
    </Layout>
  )
}
