import React, { FormEvent, ChangeEvent, useState, useEffect } from 'react'
import { useForm, Link } from '@inertiajs/inertia-react';
import epub from 'epubjs';

interface BookUploadForm {
  book?: File,
  metadata?: Metadata,
  cover?: string | ArrayBuffer | null,
}

interface Metadata {
  creator: string,
  description: string,
  direction?: string | null,
  flow: string,
  identifier: string,
  language: string,
  layout: string,
  media_active_class?: string,
  modified_date: string,
  orientation: string,
  pubdate: string,
  publisher: string,
  rights: string,
  spread: string,
  title: string,
  viewport: string,
}

export default function Upload() {
  const { data, setData, post, progress } = useForm<BookUploadForm>({
    book: undefined,
    metadata: undefined,
    cover: undefined,
  });
  const [bookCoverUrl, setBookCoverUrl] = useState<string>('');

  // You cannot use setData inside a function that also calls setData because it overwrites
  // So, we use this to chain setData calls without overwriting
  // previous changes to that hook
  useEffect(() => {
    readEpubFile(data.book);
  }, [data.book])
  useEffect(() => {
    setData('cover', bookCoverUrl);
  }, [bookCoverUrl]);

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
  function getImageFromFileReader(coverUrl: string | null) {
    if (!coverUrl) return;

    const xhr = new XMLHttpRequest();
    xhr.open("GET", coverUrl, true);
    xhr.responseType = "blob";
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;

      if (((xhr.status === 200) || (xhr.status == 0)) && (xhr.response)) {
        const ImgReader = new FileReader();
        ImgReader.onloadend = function() {
          const url = ImgReader.result as string;
          setBookCoverUrl(url);
        }
        ImgReader.readAsDataURL(xhr.response);
      }
    }
    xhr.send(null);
  }

  function readEpubFile(file?: File) {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async bookData => {
      const book = epub({ replacements: 'base64' });
      const result = bookData.target?.result as string;
      await book.open(result, 'base64');
      setData('metadata', book.packaging.metadata);
      getImageFromFileReader(await book.coverUrl());
    };

    reader.readAsArrayBuffer(file)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    console.log(data);

    if (data?.book) {

      post('/books');
    }
  }

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

      <Link
        href='/books'
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
        Back to Library
      </Link>

      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept='.epub' />
        <button type="submit">Submit</button>
      </form>
    </>
  )
}
