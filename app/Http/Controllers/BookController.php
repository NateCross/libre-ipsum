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
        // TODO: Use pagination or stagger the books in some way
        $books = auth()->user()->books->all();
        return Inertia::render('Books/Index', [
            'books' => $books,
        ]);
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


        // Remove the "data:image/png;base64" part
        // That text makes base64_decode not work
        $cover_string = explode(',', $request->input('cover'))[1];

        // The image we extract is a base64 string,
        // so we have to save it manually by using the put method
        // But we also have to decode the base64 so the image properly loads
        // or we get garbled and inaccessible data
        $filename = explode('/', $path)[1];
        $filenameNoExt = explode('.', $filename)[0];
        $cover_path = 'public/books/images/' . $filenameNoExt . '.jpg';
        Storage::put($cover_path, base64_decode($cover_string));
        $cover_path = str_replace('public/', '/storage/', $cover_path);

        $book = $user->books()->create([
            'path' => $path,
            'metadata' => json_encode($request->input('metadata')),
            'cover_image' => $cover_path,
        ]);
        return redirect('books/'.$book['id']);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Book  $book
     * @return \Illuminate\Http\Response
     */
    public function show(Book $book)
    {
        $user = auth()->user();

        // Stop unauthorized user from accessing another book
        if ($book['user_id'] != $user['id'])
            return redirect('books', 401);

        return Inertia::render('Books/Reader', [
            'book' => asset('storage/'.$book['path']),
        ]);
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
        $book['user_data'] = json_encode($request->input('userData'));
        $book->push();
        return $request->all();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Book  $book
     * @return \Illuminate\Http\Response
     */
    public function destroy(Book $book)
    {
        Storage::delete('public/'.$book['path']);
        Storage::delete($book['cover_image']);
        $book->delete();
        return $this->index;
    }
}
