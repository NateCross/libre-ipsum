import React, { FormEvent, ChangeEvent, useState } from 'react'
import { useForm } from '@inertiajs/inertia-react';
import epub from 'epubjs';
import { ReactReader } from 'react-reader';

interface BookUploadForm {
  book: File | undefined,
}

export default function Upload() {
  const { data, setData, post, progress } = useForm<BookUploadForm>({
    book: undefined,
  });
  const [bookInfo, setBookInfo] = useState('');
  const [location, setLocation] = useState<string | number | undefined>(undefined);
  const locationChanged = (epubcfi: string) => {
    setLocation(epubcfi);
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    
    // Prevents "Object may possibly be null" error
    const input = e.target as HTMLInputElement;
    if (!input.files?.length) return

    setData('book', input.files[0]);
  }

  // We use an HTTP request to get the image from the url,
  // then we can load the response into the File Reader to get
  // a base64 string of the image file that can be saved
  function getImageFromFileReader(coverUrl: string) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", coverUrl, true);
    xhr.responseType = "blob";
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;

      if (((xhr.status === 200) || (xhr.status == 0)) && (xhr.response)) {
        const ImgReader = new FileReader();
        ImgReader.onloadend = function() {
          // storeBookToLib(bookData.target.result, Lib.bookLib, "Library", metadata, ImgReader.result);

          // Need to execute the functions directly after uploading a book
          // Async await does not work here, apparently, so we use 'then'
          // to make these async functions execute one after the other
          // Lib.saveLibrary().then(() => {
          //   Lib.openReaderEvent(Lib.bookLib.length - 1)();
            // Lib.refreshLibraryDisplay();
          // });
          // showToast('Added new EPUB to Library.');
        }
        ImgReader.readAsDataURL(xhr.response);
      }
    }
    xhr.send(null);
  }

  function readEpubFile(file: File) {
    const reader = new FileReader();

    reader.onload = async bookData => {
      const book = epub({ replacements: 'base64' });
      const result = bookData.target?.result as string;
      await book.open(result, 'base64');
      setBookInfo(result);
    };

    reader.readAsArrayBuffer(file)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (data?.book) {
      readEpubFile(data?.book);

      post('/books');
    }
  }

  // let book = epub("books");
  // let book = epub("https://s3.amazonaws.com/epubjs/books/alice/OPS/package.opf");
  // let book = epub('x9MnQhZ3hr4CvfRfihF6uT4NCHYRkNARL2L0L2wd.epub');
  // let rendition = book.renderTo('display', {width: 600, height: 400});
  // let displayed = rendition.display();

  return (
    <>
      <h1
        className='
          text-xl
          text-red-500
          font-bold
        '
      >
        Upload a Book
      </h1>

      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept='.epub'  />
        <button type="submit">Submit</button>
      </form>

      {bookInfo && <div className='h-screen'>
        <ReactReader 
          location={location}
          locationChanged={locationChanged}
          url={bookInfo}
        />
      </div>}



    </>
  )
}
