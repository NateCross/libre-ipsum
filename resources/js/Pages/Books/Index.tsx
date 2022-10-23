import React, { FormEvent, useState } from 'react'
import { Link, useForm } from '@inertiajs/inertia-react';

function MoveCategoryButton({ userData, onClick, book, setUserData }) {
  const category = userData?.category || '';
  const CATEGORY_MOVE = {
    '': {
      'action': 'Favorites',
      'name': 'Add to Favorites',
    },
    'Favorites': {
      'action': '',
      'name': 'Remove from Favorites',
    },
  };
  return (
    <Link
      href={`/books/update/${book?.id}`}
      method='post'
      type='button'
      as='button'
      data={{userData}}
      onClick={() => onClick(book, CATEGORY_MOVE[category].action, setUserData)} 
    >
      {CATEGORY_MOVE[category].name}
    </Link>
  )
}

function Book({ book, id, moveCategory }) {
  // const { data, setData, post, processing } = useForm({
  //   userData: JSON.parse(book?.user_data) || {},
  // });
  const [userData, setUserData] = useState(
    JSON.parse(book?.user_data) || {}
  )

  const metadata = JSON.parse(book?.metadata);
  // const userData = JSON.parse(book?.user_data);

  // function moveCategory(categoryToMove: string) {
  //   const newData = data.userData;
  //   newData.category = categoryToMove;
  //   setData('userData', newData);
  // }

  // function handleSubmit(e: FormEvent) {
  //   e.preventDefault();
  //   post(`/books/update/${book?.id}`);
  // }

  return (
    <li
      key={id}
      id={id}
    >
      <Link 
        href={`${book?.id}`}
        className='
          hover:text-amber-700
          transition-all
        '
      >
        { /* NOTE: Please adjust the size because too big */ }
        <img 
          src={book.cover_image} 
          alt={`${metadata?.title} Cover`}
          className='
          '
        />
        <p>
          {metadata?.title ? metadata?.title : book?.path}
        </p>
      </Link>
      {/* <form onSubmit={handleSubmit}> */}
        <MoveCategoryButton 
          userData={userData}
          setUserData={setUserData}
          onClick={moveCategory}
          book={book}
        />
      {/* </form> */}
    </li>
  )
}

function Category({ books, category }) {
  console.log(books);
  const filteredBooks = books.filter((book) => (
    category ? (
      JSON.parse(book.user_data).category === category
    ) : (  // Handles empty string case or the default
      !JSON.parse(book.user_data).category
    )
  ));

  function moveCategory(book, category, setUserData) {
    const userData = JSON.parse(book.user_data);
    userData.category = category;
    setUserData(userData);
  }

  // If there is nothing in a category, don't display component
  if (!filteredBooks?.length) return null;

  return (
    <>
      <h2>{category ? category : 'Your Books'}</h2>
      <ul>
        {filteredBooks.map((book) => (
          <Book
            book={book}
            id={book.path}
            key={book.path}
            moveCategory={moveCategory}
          />
        ))}
      </ul>
      <hr />
    </>
  )
}

export default function Index({ auth, books }) {
  const CATEGORIES = [
    'Favorites',
    '', // no category
  ];

  return (
    <div>
      <h1 className='
        text-xl 
        font-bold 
        text-amber-500
      '>
        Library
      </h1>

      <Link
        href='/books/create'
        className='
          bg-red-500
          text-white
          hover:bg-white
          hover:text-red-500
          px-4
          py-2
          border-2
          border-black
          rounded
          transition-all
        '
      >
        Upload Book
      </Link>

    {CATEGORIES.map((category) => (
      <Category 
        category={category}
        books={books}
      />
    ))}

    </div>
  )
}
