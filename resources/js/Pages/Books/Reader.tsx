import React, { useState } from 'react'

import { ReactReader } from 'react-reader';

export default function Reader({ auth, book }) {
  const [location, setLocation] = useState<string | number | undefined>(undefined);

  console.log(book);

  function locationChanged(epubcfi: string) {
    setLocation(epubcfi);
  }

  return (
    <div>
      {book ? 
        (
          <div 
            className='
              h-screen
            '
          >
            <ReactReader
              location={location}
              locationChanged={locationChanged}
              url={`${book}`}
            />
          </div> 
        ) : (
          <p>Loading...</p>
        )
      }
    </div>
  )
}
