import React from 'react'

function Book({ book, id }) {
  return (
    <li
      key={id}
      id={id}
    >
      <a href={`${book?.id}`}> {/* TODO: Replace with Inertia.js router */}
        {book?.path}
      </a>
    </li>
  )
}

export default function Index({ auth, books }) {
  console.log(auth);
  console.log(books);
  return (
    <div>
      <h1 className='text-xl font-bold'>Library</h1>

      {books && <ul>
        {books.map((book, index) => (
          <Book
            book={book}
            id={book.path}
          />
        ))}
      </ul>}
    </div>
  )
}
