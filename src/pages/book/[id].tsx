import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Layout } from '@/components/Layout'
import { findBookById } from '@/utils/data'
import { useAuth } from '@/hooks/useAuth'

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0].toUpperCase())
    .slice(0, 2)
    .join('') || 'US'
}

function getAvatarUrl(avatarUrl: string | undefined, name: string) {
  if (avatarUrl?.trim()) {
    return avatarUrl
  }

  const initials = getInitials(name)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#22c55e"/><text x="50" y="55" font-family="Inter, sans-serif" font-size="40" fill="#ffffff" font-weight="700" text-anchor="middle" dominant-baseline="middle">${initials}</text></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

export default function BookViewerPage() {
  const router = useRouter()
  const { id } = router.query
  const book = typeof id === 'string' ? findBookById(id) : undefined
  const { user, registerRead } = useAuth()

  const [comments, setComments] = useState<Array<any>>([])
  const [newComment, setNewComment] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')

  useEffect(() => {
    if (!book) return
    try {
      const raw = window.localStorage.getItem('biblioteca-comments')
      const all = raw ? JSON.parse(raw) : []
      const bookComments = all.filter((c: any) => c.bookId === book.id)
      setComments(bookComments.map((c: any) => ({ ...c, replies: c.replies || [] })))
    } catch {
      setComments([])
    }
  }, [book])

  const saveCommentsForBook = (next: Array<any>) => {
    try {
      const raw = window.localStorage.getItem('biblioteca-comments')
      const all = raw ? JSON.parse(raw) : []
      const others = all.filter((c: any) => c.bookId !== book?.id)
      window.localStorage.setItem('biblioteca-comments', JSON.stringify([...others, ...next]))
    } catch {}
  }

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!book) return
    if (!user) return alert('Debes iniciar sesión para comentar')
    if (!newComment.trim()) return
    const comment = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
      bookId: book.id,
      userId: user.id,
      name: user.name,
      avatarUrl: user.avatarUrl || getAvatarUrl(undefined, user.name),
      role: user.role,
      text: newComment.trim(),
      timestamp: new Date().toISOString(),
    }
    const next = [...comments, comment]
    setComments(next)
    saveCommentsForBook(next)
    setNewComment('')
  }

  const handleDeleteComment = (commentId: string) => {
    if (!book) return
    if (!confirm('¿Eliminar este comentario?')) return
    const next = comments.filter((c) => c.id !== commentId)
    setComments(next)
    saveCommentsForBook(next)
  }

  const startEditComment = (c: any) => {
    setEditingId(c.id)
    setEditingText(c.text || '')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingText('')
  }

  const saveEdit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!editingId) return
    const next = comments.map((c) => (c.id === editingId ? { ...c, text: editingText, editedAt: new Date().toISOString() } : c))
    setComments(next)
    saveCommentsForBook(next)
    setEditingId(null)
    setEditingText('')
  }

  const handleAddReply = (e: React.FormEvent, parentId: string) => {
    e.preventDefault()
    if (!book || !user || !replyText.trim()) return
    const reply = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      userId: user.id,
      name: user.name,
      avatarUrl: user.avatarUrl || getAvatarUrl(undefined, user.name),
      role: user.role,
      text: replyText.trim(),
      timestamp: new Date().toISOString(),
    }
    const next = comments.map((c) => (c.id === parentId ? { ...c, replies: [...(c.replies || []), reply] } : c))
    setComments(next)
    saveCommentsForBook(next)
    setReplyingTo(null)
    setReplyText('')
  }

  const handleDeleteReply = (commentId: string, replyId: string) => {
    if (!confirm('¿Eliminar esta respuesta?')) return
    const next = comments.map((c) => (c.id === commentId ? { ...c, replies: c.replies.filter((r: any) => r.id !== replyId) } : c))
    setComments(next)
    saveCommentsForBook(next)
  }

  const handleEditReply = (commentId: string, replyId: string, newText: string) => {
    const next = comments.map((c) => (c.id === commentId ? { ...c, replies: c.replies.map((r: any) => (r.id === replyId ? { ...r, text: newText, editedAt: new Date().toISOString() } : r)) } : c))
    setComments(next)
    saveCommentsForBook(next)
  }

  useEffect(() => {
    if (book && user) {
      registerRead(book.id, book.title)
    }
  }, [book, user, registerRead])

  if (!router.isReady) {
    return (
      <Layout>
        <section className="page-panel">
          <h1>Cargando libro...</h1>
          <p>Espera un momento mientras preparamos el lector PDF.</p>
        </section>
      </Layout>
    )
  }

  if (!book) {
    return (
      <Layout>
        <section className="page-panel">
          <h1>Libro no encontrado</h1>
          <p>El libro seleccionado no está disponible en este momento.</p>
        </section>
      </Layout>
    )
  }

  return (
    <Layout>
      <Head>
        <title>{book.title} · Biblioteca Digital Camilo Daza</title>
      </Head>

      <section className="book-viewer-panel">
        <div className="book-summary-card">
          <div className="book-view-cover">
            <Image src={book.cover} alt={book.title} fill sizes="(max-width: 768px) 100vw, 280px" />
          </div>
          <div>
            <h1>{book.title}</h1>
            <p>{book.author}</p>
            <p className="book-summary">{book.summary}</p>
            <a href={book.pdfUrl} download className="download-button">
              Descargar PDF
            </a>
          </div>
        </div>

        <div className="pdf-frame-wrapper">
          <iframe
            src={book.pdfUrl}
            title={book.title}
            className="pdf-frame"
          />
        </div>

        <section className="comments-section page-panel">
          <h2>Comentarios de lectura</h2>
          <form onSubmit={handleAddComment} className="auth-form">
            <label>
              {user ? `Comentando como ${user.name}` : 'Inicia sesión para comentar'}
              <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Escribe un comentario sobre este libro..." />
            </label>
            <div>
              <button className="primary-button" type="submit">Comentar</button>
            </div>
          </form>

          <div className="comments-list">
            {comments.length === 0 ? <p className="note">No hay comentarios aún.</p> : null}
            {comments.map((c) => (
              <div key={c.id} className="comment">
                <img src={getAvatarUrl(c.avatarUrl, c.name)} alt={c.name} className="comment-avatar" />
                <div className="comment-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <strong>{c.name}</strong>
                      {c.role === 'admin' && <span className="comment-role-badge comment-role-admin">Admin</span>}
                      {c.role === 'owner' && <span className="comment-role-badge comment-role-owner">Owner</span>}
                    </div>
                    {user && user.id === c.userId && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="secondary-button" type="button" onClick={() => startEditComment(c)}>
                          Editar
                        </button>
                        <button className="logout-button" type="button" onClick={() => handleDeleteComment(c.id)}>
                          Borrar
                        </button>
                      </div>
                    )}
                  </div>

                  {editingId === c.id ? (
                    <form onSubmit={saveEdit} style={{ marginTop: '0.5rem' }}>
                      <textarea value={editingText} onChange={(e) => setEditingText(e.target.value)} />
                      <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                        <button className="primary-button" type="submit">Guardar</button>
                        <button className="secondary-button" type="button" onClick={cancelEdit}>Cancelar</button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="comment-text">{c.text}</div>
                      <div className="comment-meta">{new Date(c.timestamp).toLocaleString()}{c.editedAt ? ' · editado' : ''}</div>
                      <button className="reply-button" type="button" onClick={() => setReplyingTo(c.id)}>
                        Responder
                      </button>
                    </>
                  )}

                  {replyingTo === c.id && (
                    <form onSubmit={(e) => handleAddReply(e, c.id)} style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                      <label style={{ display: 'grid', gap: '0.5rem' }}>
                        <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Escribe una respuesta..." />
                      </label>
                      <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                        <button className="primary-button" type="submit">Responder</button>
                        <button className="secondary-button" type="button" onClick={() => { setReplyingTo(null); setReplyText(''); }}>Cancelar</button>
                      </div>
                    </form>
                  )}

                  {c.replies && c.replies.length > 0 && (
                    <div className="replies-section">
                      {c.replies.map((r: any) => (
                        <div key={r.id} className="reply">
                          <img src={getAvatarUrl(r.avatarUrl, r.name)} alt={r.name} className="comment-avatar" />
                          <div className="comment-body">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <strong>{r.name}</strong>
                                {r.role === 'admin' && <span className="comment-role-badge comment-role-admin">Admin</span>}
                                {r.role === 'owner' && <span className="comment-role-badge comment-role-owner">Owner</span>}
                              </div>
                              {user && user.id === r.userId && (
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                  <button className="secondary-button" type="button" onClick={() => { setEditingId(r.id); setEditingText(r.text); }}>
                                    Editar
                                  </button>
                                  <button className="logout-button" type="button" onClick={() => handleDeleteReply(c.id, r.id)}>
                                    Borrar
                                  </button>
                                </div>
                              )}
                            </div>
                            {editingId === r.id ? (
                              <form onSubmit={(e) => { e.preventDefault(); handleEditReply(c.id, r.id, editingText); setEditingId(null); }} style={{ marginTop: '0.5rem' }}>
                                <textarea value={editingText} onChange={(e) => setEditingText(e.target.value)} />
                                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                                  <button className="primary-button" type="submit">Guardar</button>
                                  <button className="secondary-button" type="button" onClick={() => setEditingId(null)}>Cancelar</button>
                                </div>
                              </form>
                            ) : (
                              <>
                                <div className="comment-text">{r.text}</div>
                                <div className="comment-meta">{new Date(r.timestamp).toLocaleString()}{r.editedAt ? ' · editado' : ''}</div>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>
    </Layout>
  )
}
