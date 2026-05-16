import Link from 'next/link'
import { BookRecord } from '@/utils/data'

interface BookCardProps {
  book: BookRecord
}

export function BookCard({ book }: BookCardProps) {
  return (
    <Link href={`/book/${book.id}`} className="book-card-link">
      <article className="book-card">
        <div className="book-cover" style={{ backgroundImage: `url(${book.cover})` }} />
        <div className="book-card-body">
          <h3>{book.title}</h3>
          <p>{book.author}</p>
          <span className="book-category">{book.category}</span>
        </div>
      </article>
    </Link>
  )
}
