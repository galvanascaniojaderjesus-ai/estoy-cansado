export interface BookRecord {
  id: string
  title: string
  author: string
  category: string
  cover: string
  summary: string
  popularity: number
  reads: number
  pdfUrl: string
}

export const books: BookRecord[] = [
  {
    id: 'libro-5',
    title: 'El Principito',
    author: 'Antoine de Saint-Exupéry',
    category: 'Infantil',
    cover: '/portadas/portada_principito.png',
    summary: '“El Principito” es una fábula poética escrita por Antoine de Saint‑Exupéry en 1943 que narra el encuentro entre un piloto perdido en el desierto y un pequeño príncipe proveniente del asteroide B‑612. A través de sus viajes y personajes, la obra reflexiona sobre la amistad, el amor y la forma en que los adultos pierden la capacidad de ver con el corazón.',
    popularity: 1,
    reads: 5,
    pdfUrl: '/libros/El principito (Antoine de Saint-Exupery) (z-library.sk, 1lib.sk, z-lib.sk).pdf',
  },
  {
    id: 'libro-1',
    title: 'Cien años de soledad',
    author: 'Gabriel García Márquez',
    category: 'Historia',
    cover: '/portadas/100añosdesoledadportada.png',
    summary: 'Una novela magistral que cuenta la historia de la familia Buendía a través de siete generaciones en el pueblo ficticio de Macondo.',
    popularity: 10,
    reads: 45,
    pdfUrl: '/libros/Cien Años de Soledad (Gabriel García Márquez) (z-library.sk, 1lib.sk, z-lib.sk).pdf',
  },
  {
    id: 'libro-2',
    title: 'Don Quijote',
    author: 'Miguel de Cervantes',
    category: 'Historia',
    cover: '/portadas/portada_don_quijote.png',
    summary: 'La historia del ingeniero hidalgo que pierde la cordura leyendo libros de caballerías y sale en busca de aventuras.',
    popularity: 12,
    reads: 50,
    pdfUrl: '/libros/don-quijote.pdf',
  },
  {
    id: 'libro-3',
    title: 'Orgullo y prejuicio',
    author: 'Jane Austen',
    category: 'Romance',
    cover: '/portadas/portada_orgullo_prejuicio.png',
    summary: 'Una novela de romance y sociedad que sigue la vida de Elizabeth Bennet y su encuentro con el rico y reservado Mr. Darcy.',
    popularity: 8,
    reads: 35,
    pdfUrl: '/libros/orgullo-y-prejuicio.pdf',
  },
  {
    id: 'libro-4',
    title: 'El Hobbit',
    author: 'J.R.R. Tolkien',
    category: 'Fantasía',
    cover: '/portadas/portada_hobbit.png',
    summary: 'La aventura de Bilbo Bolsón, un hobbit ordinario, quien es arrastrado a una épica búsqueda del tesoro.',
    popularity: 11,
    reads: 42,
    pdfUrl: '/libros/el-hobbit.pdf',
  },
  {
    id: 'libro-6',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    category: 'Autoayuda',
    cover: '/portadas/portada_sapiens.png',
    summary: 'Un recorrido por la historia de la humanidad desde el surgimiento del Homo sapiens hasta la era moderna.',
    popularity: 9,
    reads: 38,
    pdfUrl: '/libros/sapiens.pdf',
  },
  {
    id: 'libro-7',
    title: 'El código Da Vinci',
    author: 'Dan Brown',
    category: 'Tecnología',
    cover: '/portadas/portada_codigo_davinci.png',
    summary: 'Un thriller que mezcla misterio, arte, historia y religión en una búsqueda acelerada por París y Roma.',
    popularity: 7,
    reads: 30,
    pdfUrl: '/libros/el-codigo-davinci.pdf',
  },
  {
    id: 'libro-8',
    title: 'Alicia en el país de las maravillas',
    author: 'Lewis Carroll',
    category: 'Infantil',
    cover: '/portadas/portada_alicia.png',
    summary: 'La aventura surrealista de Alicia a través de un mundo imaginario lleno de personajes excéntricos y lógica invertida.',
    popularity: 6,
    reads: 25,
    pdfUrl: '/libros/alicia-pais-maravillas.pdf',
  },
]

export const categories = [
  { name: 'Fantasía', description: 'Mundos imaginarios, magia y aventuras.' },
  { name: 'Romance', description: 'Historias de amor y relaciones emotivas.' },
  { name: 'Tecnología', description: 'Tendencias digitales, programación y ciencia.' },
  { name: 'Autoayuda', description: 'Crecimiento personal y hábitos sanos.' },
  { name: 'Historia', description: 'Relatos del pasado y eventos relevantes.' },
  {name: 'Infantil', description: 'Libros para niños con enseñanzas y diversión.' },
]

export const authors: { name: string; bio: string; image?: string }[] = [
  {
    name: 'Antoine de Saint-Exupéry',
    bio: 'Escritor de fantasía contemporánea y narrativas sensibles.',
    image: '/authors/Antoine.png',
  },
  {
    name: 'Gabriel García Márquez',
    bio: 'Novelista, periodista y Nobel de Literatura. Autor de Cien años de soledad.',
    image: '/authors/gabo.png',
  },
]

export const recommendedBooks = books;
export const popularBooks = books;

export function findBookById(id: string): BookRecord | undefined {
  return books.find((book) => book.id === id)
}

export function getBooksByCategory(categoryName: string): BookRecord[] {
  return books.filter((book) => book.category.toLowerCase() === categoryName.toLowerCase())
}

export function getAllCategories() {
  return categories
}
