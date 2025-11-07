'use client';

import { Movie } from "@/app/models/Movie";
import { useState } from "react";
import Image from "next/image";

export default function AddMovieDialog() {
    const [newMovies, setNewMovies] = useState<Movie[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    const searchMovies = async (query: string) => {
        fetch('/api/movie/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query }),
        })
            .then(response => response.json())
            .then(data => {
                setNewMovies(data);
            })
            .catch(error => console.error("Error searching movies:", error));
    };

    const addMovie = async (id: number) => {
        const movieToAdd = newMovies.find(movie => movie.id === id);
        if (!movieToAdd) return;

        try {
            const response = await fetch('/api/movie/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(movieToAdd),
            });

            if (!response.ok) throw new Error("Failed to add movie");

            window.location.reload();
        } catch (error) {
            console.error("Error adding movie:", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-lg p-6 w-[500px]">
                <h2 className="text-2xl font-bold mb-4 text-gray-100">Add New Movie</h2>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            searchMovies(searchQuery);
                        }
                    }}
                />

                <button
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors hover:cursor-pointer"
                    onClick={() => searchMovies(searchQuery)}
                >
                    Search
                </button>

                {newMovies.length > 0 && (
                    <div className="mt-4 bg-gray-800 rounded-lg p-4 max-h-[600px] overflow-y-auto">
                        <h3 className="text-xl font-semibold mb-2 text-gray-100">Search Results</h3>
                        <ul>
                            {newMovies.map((movie) => (
                                <li
                                    key={movie.id}
                                    className="mb-2 p-2 bg-gray-700 rounded hover:bg-gray-600 cursor-pointer flex gap-3"
                                    onClick={() => addMovie(movie.id)}
                                >
                                    {/* Poster */}
                                    {movie.poster ? (
                                        <div className="shrink-0 w-16 h-24 relative">
                                            <Image
                                                src={movie.poster}
                                                alt={movie.title || "Poster"}
                                                fill
                                                className="object-contain rounded"
                                            />
                                        </div>
                                    ) : (
                                        <div className="shrink-0 w-16 h-24 bg-gray-600 flex items-center justify-center text-gray-400 text-xs rounded">
                                            No Poster
                                        </div>
                                    )}

                                    {/* Title and Summary */}
                                    <div className="flex flex-col justify-between overflow-hidden">
                                        <h4 className="text-lg font-medium text-gray-100 truncate">{movie.title}</h4>
                                        {movie.year && <p className="text-gray-400 text-sm">{movie.year}</p>}
                                        {movie.summary && (
                                            <p
                                                className="text-gray-300 text-sm line-clamp-3"
                                                title={movie.summary}
                                            >
                                                {movie.summary}
                                            </p>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
