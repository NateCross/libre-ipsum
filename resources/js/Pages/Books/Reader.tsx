import React, { useEffect, useState } from 'react'

import { ReactReader } from 'react-reader';

export default function Reader({ auth, book }) {
  const [bookData, setBookData] = useState<string | null>(1);
  const [location, setLocation] = useState<string | number | undefined>(undefined);

  console.log(book);

  // Fetch book from path and convert to arraybuffer that can be read
  // useEffect(() => {

  // });

  function locationChanged(epubcfi: string) {
    setLocation(epubcfi);
  }

  return (
    <div>

      {bookData ? 
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
