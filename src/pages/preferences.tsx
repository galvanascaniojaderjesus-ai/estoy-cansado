import Head from 'next/head'
import { useMemo } from 'react'
import { Layout } from '@/components/Layout'
import { useAuth } from '@/hooks/useAuth'
import { books } from '@/utils/data'

export default function PreferencesPage() {
  const { user, history } = useAuth()

  const favoriteCategory = useMemo(() => {
    const categoryCounts = history.reduce<Record<string, number>>((counts, item) => {
      const book = books.find((entry) => entry.title === item.subject)
      if (book) {
        counts[book.category] = (counts[book.category] || 0) + 1
      }
      return counts
    }, {})

    const winner = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]
    return winner ? winner[0] : 'Fantasía'
  }, [history])

  const recommendations = books.filter((book) => book.category === favoriteCategory)

  return (
    <Layout>
      <Head>
        <title>Preferencias · Biblioteca Digital Camilo Daza</title>
      </Head>

      <section className="page-panel">
        <h1>Preferencias</h1>
        {!user ? (
          <div className="panel-card">
            <p>Inicia sesión para guardar tus preferencias y recomendaciones personalizadas.</p>
          </div>
        ) : (
          <>
            <div className="panel-card">
              <p>Preferencias registradas para el usuario <strong>{user.name}</strong>.</p>
              <p>Temas preferidos: {favoriteCategory}</p>
            </div>
            <div className="info-grid">
              {recommendations.map((book) => (
                <article key={book.id} className="recommendation-card">
                  <div className="book-cover-small" style={{ backgroundImage: `url(${book.cover})` }} />
                  <div>
                    <h2>{book.title}</h2>
                    <p>{book.author}</p>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </Layout>
  )
}
