'use client';

import { Movie } from "../../models/Movie";
import MovieListItem from "../MovieListItem";
import { useState } from "react";

export default function MovieList({ movies }: { movies: Movie[] }) {
    const [filterWatched, setFilterWatched] = useState(false);
    const [sortOption, setSortOption] = useState("title-asc");
    const [view, setView] = useState<'grid' | 'list'>('list');

    const sortMovies = (movies: Movie[]) => {
        return movies.sort((a, b) => {
            switch (sortOption) {
                case "title-asc":
                    return a.title.localeCompare(b.title);
                case "title-desc":
                    return b.title.localeCompare(a.title);
                case "year-asc":
                    return (parseInt(a.year || "0") - parseInt(b.year || "0"));
                case "year-desc":
                    return (parseInt(b.year || "0") - parseInt(a.year || "0"));
                case "rating-asc":
                    return (a.rating || 0) - (b.rating || 0);
                case "rating-desc":
                    return (b.rating || 0) - (a.rating || 0);
                default:
                    return 0;
            }
        });
    }

    if (!movies || movies.length === 0) {
        return (
            <div className="text-center text-gray-400 py-12">
                <p>No movies found.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 p-4">
            <div className="flex flex-wrap items-center gap-6 mb-4">
                {/* Filter Unwatched */}
                <label className="flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        className="h-5 w-5 text-blue-500 rounded border-gray-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                        checked={filterWatched}
                        onChange={() => setFilterWatched(!filterWatched)}
                    />
                    <span className="ml-2 text-gray-200 font-medium hover:text-white transition-colors">
                        Show Unwatched Movies Only
                    </span>
                </label>

                {/* Sort Select */}
                <label className="flex items-center cursor-pointer">
                    <span className="mr-2 text-gray-200 font-medium hover:text-white transition-colors">
                        Sort By
                    </span>
                    <select
                        className="h-8 w-44 bg-gray-800 text-gray-100 border border-gray-600 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        onChange={(event) => setSortOption(event.target.value)}
                        value={sortOption}
                    >
                        <option value="title-asc">Title (A-Z)</option>
                        <option value="title-desc">Title (Z-A)</option>
                        <option value="year-asc">Year (Oldest First)</option>
                        <option value="year-desc">Year (Newest First)</option>
                        <option value="rating-asc">Rating (Lowest First)</option>
                        <option value="rating-desc">Rating (Highest First)</option>
                    </select>
                </label>

                <div className="inline-flex items-center rounded-full bg-gray-800 p-1">
                    {/* Grid button */}
                    <button
                        type="button"
                        onClick={() => setView('grid')}
                        title="Grid view"
                        aria-label="Grid view"
                        className={`flex items-center justify-center rounded-full p-2 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${view === 'grid'
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-200 hover:bg-gray-700'
                            }`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path d="M3 3h4v4H3V3zM7 3h4v4H7V3zM11 3h4v4h-4V3zM3 7h4v4H3V7zM7 7h4v4H7V7zM11 7h4v4h-4V7zM3 11h4v4H3v-4zM7 11h4v4H7v-4zM11 11h4v4h-4v-4z" />
                        </svg>
                    </button>

                    {/* Separator */}
                    <span className="mx-1 w-px bg-gray-700" />

                    {/* List button */}
                    <button
                        type="button"
                        onClick={() => setView('list')}
                        title="List view"
                        aria-label="List view"
                        className={`flex items-center justify-center rounded-full p-2 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${view === 'list'
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-200 hover:bg-gray-700'
                            }`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                fillRule="evenodd"
                                d="M3 4.5A1.5 1.5 0 014.5 3h11A1.5 1.5 0 0117 4.5v1A1.5 1.5 0 0115.5 7h-11A1.5 1.5 0 013 5.5v-1zM3 10.5A1.5 1.5 0 014.5 9h11A1.5 1.5 0 0117 10.5v1A1.5 1.5 0 0115.5 13h-11A1.5 1.5 0 013 11.5v-1zM3 16.5A1.5 1.5 0 014.5 15h11A1.5 1.5 0 0117 16.5v1A1.5 1.5 0 0115.5 19h-11A1.5 1.5 0 013 17.5v-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            <div className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'flex flex-col gap-4'}>
                {!filterWatched && sortMovies(movies).map((movie) => (
                    <MovieListItem key={movie.id} movie={movie} view={view} />
                ))}
                {filterWatched && sortMovies(movies).filter(m => !m.watched).map((movie) => (
                    <MovieListItem key={movie.id} movie={movie} view={view} />
                ))}
            </div>
        </div>
    );
}
