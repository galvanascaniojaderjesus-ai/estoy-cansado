import Head from 'next/head'
import { Layout } from '@/components/Layout'

export default function BibliotecaDigitalColCamiloDazaPage() {
  return (
    <Layout>
      <Head>
        <title>BIBLIOTECA DIGITAL CAMILO DAZA</title>
      </Head>

      <section className="page-panel">
        <h1>BIBLIOTECA DIGITAL CAMILO DAZA</h1>
        <p className="section-subtitle">
          Bienvenido a la página especial de la biblioteca. Aquí puedes ver el catálogo,
          recomendaciones, historial y todo el contenido disponible en la app.
        </p>
        <div className="panel-card">
          <p>
            Esta página está disponible en la URL exacta:
            <strong> /bibliotecadigital-colcamilodaza</strong>
          </p>
          <p>
            Si quieres, puedo añadir un enlace directo a esta página en el menú superior.
          </p>
        </div>
      </section>
    </Layout>
  )
}
