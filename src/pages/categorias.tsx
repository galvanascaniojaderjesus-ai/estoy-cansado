import Head from 'next/head'
import Link from 'next/link'
import { Layout } from '@/components/Layout'
import { categories, getBooksByCategory } from '@/utils/data'

export default function CategoriesPage() {
  return (
    <Layout>
      <Head>
        <title>Categorías · Biblioteca Digital Camilo Daza</title>
      </Head>

      <section className="page-panel">
        <h1>Categorías</h1>
        <p className="section-subtitle">Explora los libros organizados por categorías.</p>

        {categories.map((category) => {
          const books = getBooksByCategory(category.name)
          return (
            <div key={category.name} className="category-block">
              <div className="category-header">
                <h2>{category.name}</h2>
                <p className="category-description">{category.description}</p>
                <p className="category-meta">
                  {books.length} {books.length === 1 ? 'libro' : 'libros'}
                </p>
              </div>

              {books.length === 0 ? (
                <p style={{ color: 'var(--muted-color)', fontStyle: 'italic' }}>No hay libros en esta categoría todavía.</p>
              ) : (
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
              )}
            </div>
          )
        })}
      </section>
    </Layout>
  )
}
