'use client';

import Image from "next/image";
import { Movie } from "../../models/Movie";
import { useState } from "react";

export default function MovieListItem({ movie }: { movie: Movie }) {
  const [watchedMovie, setWatchedMovie] = useState(movie.watched);
  const [ratingMovie, setRatingMovie] = useState(movie.rating);
  const [commentsMovie, setCommentsMovie] = useState(movie.comments);

  const updateWatchedStatus = async (watched: boolean) => {
    const updatedMovie = { ...movie, watched };

    await fetch('/api/movie/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedMovie),
    });

    setWatchedMovie(watched);
  };

  const updateRating = async () => {
    const rating = prompt("Enter your rating (0-10):");
    if (rating === null) return; // User cancelled
    const ratingNum = parseInt(rating);
    if (isNaN(ratingNum) || ratingNum < 0 || ratingNum > 10) {
      alert("Please enter a valid rating between 0 and 10.");
      return;
    }

    setRatingMovie(parseInt(rating));
    const updatedMovie = { ...movie, rating: parseInt(rating) };

    await fetch('/api/movie/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedMovie),
    });
  };

  const updateComments = async () => {
    const comments = prompt("Enter your comments:", commentsMovie || "");
    if (comments === null) return; // User cancelled

    setCommentsMovie(comments);
    const updatedMovie = { ...movie, comments };

    await fetch('/api/movie/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedMovie),
    });
  }

  return (
    <div className="flex flex-row bg-gray-900 rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Poster */}
      {movie.poster ? (
        <div className="w-1/6 shrink-0 flex items-start justify-center m-2 rounded-xl">
          <div className="relative w-full aspect-2/3 rounded-xl">
            <Image
              src={movie.poster}
              alt={movie.title || "Movie poster"}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="rounded-xl object-contain"
              unoptimized
            />
          </div>
        </div>
      ) : (
        <div className="w-1/6 flex items-center justify-center bg-gray-800 text-gray-500 text-sm aspect-2/3">
          No poster
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col justify-between p-6 w-5/6">
        <div>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">
            {movie.title || "Untitled"}
          </h2>
          {movie.year && (
            <p className="text-gray-400 text-lg mb-4">
              {movie.year}
            </p>
          )}
          {movie.summary && (
            <p className="text-gray-300 mb-4 line-clamp-4">
              {movie.summary}
            </p>
          )}
        </div>

        {/* Details Footer */}
        <div className="flex items-center justify-between text-sm mt-4">
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium hover:cursor-pointer ${
                watchedMovie
                  ? "bg-green-900 text-green-300"
                  : "bg-yellow-900 text-yellow-300"
              }`}
              onClick={() => updateWatchedStatus(!watchedMovie)}
            >
              {watchedMovie ? "Watched" : "To Watch"}
            </span>

            {ratingMovie !== null && ratingMovie !== undefined && (
              <span className="flex items-center gap-1 text-yellow-400 hover:cursor-pointer" onClick={updateRating}>
                ⭐ {ratingMovie}/10
              </span>
            )}
            {ratingMovie === null && (
              <span
                className="px-3 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-400 hover:cursor-pointer"
                onClick={updateRating}
              >
                ⭐ Rate Movie
              </span>
            )}
          </div>

          {commentsMovie && (
            <p className="italic text-gray-400 truncate max-w-[50%] hover:cursor-pointer" title={commentsMovie} onClick={updateComments}>
              “{commentsMovie}”
            </p>
          )}

          {!commentsMovie && (
            <p className="px-3 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-400 hover:cursor-pointer" onClick={updateComments}>
              Add Comment
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
