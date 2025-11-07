'use client';

import Image from "next/image";
import { Movie } from "../../models/Movie";
import { useState } from "react";

export default function MovieListItem({ movie, view }: { movie: Movie, view: 'grid' | 'list' }) {
  const [watchedMovie, setWatchedMovie] = useState(movie.watched);
  const [ratingMovie, setRatingMovie] = useState(movie.rating);
  const [commentsMovie, setCommentsMovie] = useState(movie.comments);
  const [requesting, setRequesting] = useState(false);

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

  const requestMovie = async (id: number) => {
    setRequesting(true);
    fetch('/api/plex/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
      .then(response => {
        if (!response.ok) throw new Error("Failed to request movie");
        setRequesting(false);
        window.location.reload();
      })
      .then(data => {
        alert("Movie requested successfully!");
        console.log("Plex request response:", data);
      })
      .catch(error => {
        console.error("Error requesting movie:", error);
        alert("Error requesting movie.");
      });
  };

  return (
    <div
      className="relative flex flex-row rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
      style={
        view === 'grid'
          ? { backgroundImage: `url('${movie.poster}')`, backgroundSize: 'cover', backgroundPosition: 'center' }
          : { backgroundColor: '#111827' }
      }
    >

      {view === 'grid' && (
        <div className="absolute inset-0 bg-black/85" aria-hidden="true"></div>
      )}

      {/* Poster */}
      {movie.poster && view == "list" ? (
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
      ) : view == "list" ? (
        <div className="w-1/6 flex items-center justify-center bg-gray-800 text-gray-500 text-sm aspect-2/3">
          No poster
        </div>
      ) : ''}

      {/* Content */}
      <div
        className={`flex flex-col justify-between p-6 relative ${view === 'grid' ? 'w-6/6' : 'w-5/6'
          }`}
      >
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
        <div className={`flex items-center justify-between text-sm mt-4 ${view === 'grid' ? 'flex-col items-start gap-3' : ''}`}>
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium hover:cursor-pointer ${watchedMovie
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

            {movie.available ? (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-600 text-green-100">
                Available on Plex
              </span>
            ) : movie.requested ? (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-500 text-white">
                Requested on Plex
              </span>
            ) : (
              <button
                className="px-3 py-1 rounded-full text-xs font-medium bg-red-600 text-white hover:bg-red-700 transition-colors duration-200 hover:cursor-pointer"
                onClick={() => requestMovie(movie.id)}
              >
                Request on Plex
              </button>
            )}

          </div>

          
        </div>
        <div>
        {commentsMovie && (
            <p className={`italic py-3 text-gray-400 ${view == "list" ? "max-w-[50%]" : "max-w-full"} hover:cursor-pointer mt-2`} title={commentsMovie} onClick={updateComments}>
              “{commentsMovie}”
            </p>
          )}

          {!commentsMovie && (
            <p className="px-3 py-3 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-400 hover:cursor-pointer mt-2 w-30 text-center" onClick={updateComments}>
              Add Comment
            </p>
          )}
          </div>
      </div>

      {requesting && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-70 text-white">
          <p className="text-lg font-semibold mb-2">Requesting...</p>
          <p className="text-sm">Please wait</p>
        </div>
      )}

    </div>
  );
}
