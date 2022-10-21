<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BookController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        return Inertia::render('Books/Index', [
            'books' => auth()->user()->books->all(),
        ]);
        //
        // return Storage::download('6fKe2Hcf0sD9dHn7du9IPQuXM3M2T5372C4P1HP3.epub');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return Inertia::render('Books/Upload', []);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $user = $request->user();
        $path = $request->file('book')->store('public/books');
        // Remove the public part of the url
        $path = str_replace('public/', '', $path);
        $book = $user->books()->create([
            'path' => $path,
        ]);
        // $book = Book::create([
        //     'path' => $path,
        // ]);
        return redirect($path);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Book  $book
     * @return \Illuminate\Http\Response
     */
    public function show(Book $book)
    {
        // echo Storage::get($book['path']);
        // return Storage::download($book->path);
        return Inertia::render('Books/Reader', [
        //     // 'book' => ,
            'book' => asset('storage/'.$book['path']),
        //     // 'book' => Storage::url($book['path']),
        //     // 'book' => Storage::get($book['path']),
        // // return Storage::download('6fKe2Hcf0sD9dHn7du9IPQuXM3M2T5372C4P1HP3.epub');
        ]);
    }

    public function all(Request $request)
    {
        // $books = $request->user()->books;
        return $request->user()->books->all();
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Book  $book
     * @return \Illuminate\Http\Response
     */
    public function edit(Book $book)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Book  $book
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Book $book)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Book  $book
     * @return \Illuminate\Http\Response
     */
    public function destroy(Book $book)
    {
        //
    }
}
