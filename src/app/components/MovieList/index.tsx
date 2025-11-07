'use client';

import { Movie } from "../../models/Movie";
import MovieListItem from "../MovieListItem";
import { useState } from "react";

export default function MovieList({ movies }: { movies: Movie[] }) {
    const [filterWatched, setFilterWatched] = useState(false);
    const [sortOption, setSortOption] = useState("title-asc");

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
            </div>

            {!filterWatched && sortMovies(movies).map((movie) => (
                <MovieListItem key={movie.id} movie={movie} />
            ))}
            {filterWatched && sortMovies(movies).filter(m => !m.watched).map((movie) => (
                <MovieListItem key={movie.id} movie={movie} />
            ))}
        </div>
    );
}
