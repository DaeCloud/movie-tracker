'use client';

import Image from "next/image";
import { Movie } from "../../models/Movie";
import { useState } from "react";

export default function MovieListItem({
  movie,
  view,
}: {
  movie: Movie;
  view: "grid" | "list" | "poster";
}) {
  const [watchedMovie, setWatchedMovie] = useState(movie.watched);
  const [ratingMovie, setRatingMovie] = useState(movie.rating);
  const [commentsMovie, setCommentsMovie] = useState(movie.comments);
  const [requestedMovie, setRequestedMovie] = useState(movie.requested);
  const [requesting, setRequesting] = useState(false);
  const [requestList, setRequestList] = useState([]);

  // ------------------------ UPDATE FUNCTIONS ---------------------------------

  const updateWatchedStatus = async (watched: boolean) => {
    const updatedMovie = {
      ...movie,
      watched,
      rating: ratingMovie,
      comments: commentsMovie,
    };

    await fetch("/api/movie/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedMovie),
    });

    setWatchedMovie(watched);
  };

  const updateRating = async () => {
    const rating = prompt("Enter your rating (0-10):");
    if (rating === null) return;
    const ratingNum = parseInt(rating);
    if (isNaN(ratingNum) || ratingNum < 0 || ratingNum > 10) {
      alert("Please enter a valid rating between 0 and 10.");
      return;
    }

    setRatingMovie(ratingNum);

    const updatedMovie = {
      ...movie,
      rating: ratingNum,
      watched: watchedMovie,
      comments: commentsMovie,
    };

    await fetch("/api/movie/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedMovie),
    });
  };

  const updateComments = async () => {
    const comments = prompt("Enter your comments:", commentsMovie || "");
    if (comments === null) return;

    setCommentsMovie(comments);

    const updatedMovie = {
      ...movie,
      comments,
      watched: watchedMovie,
      rating: ratingMovie,
    };

    await fetch("/api/movie/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedMovie),
    });
  };

  const requestMovie = async (id: number) => {
    setRequesting(true);
    setRequestList([
      ...requestList,
      id
    ]);

    fetch("/api/plex/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    .then((response) => {
      if (!response.ok) throw new Error("Failed to request movie");
      setRequesting(false);
      setRequestList(requestList.filter(r => r != id));

      setRequestedMovie(true);
    })
    .catch((error) => {
      console.error("Error requesting movie:", error);
      alert("Error requesting movie.");
      setRequesting(false);
      setRequestList(requestList.filter(r => r != id));
    });
  };

  // ------------------------ POSTER VIEW --------------------------------------

  if (view === "poster") {
    return (
      <div className="relative flex flex-col w-48 bg-gray-900 rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">

        {/* Rotten Tomatoes */}
        {movie.critic && (
          <span className="absolute top-2 left-2 z-20 bg-red-200 text-red-900 text-xs font-bold px-2 py-1 rounded-full shadow flex items-center gap-1">
            🍅 {movie.critic}
          </span>
        )}

        {/* Watched Toggle */}
        <button
          type="button"
          className={`absolute top-2 right-2 z-20 w-6 h-6 flex items-center justify-center rounded-full shadow-md focus:outline-none transition-colors hover:cursor-pointer ${watchedMovie
            ? "bg-green-600"
            : "bg-gray-800 hover:bg-green-600"
            }`}
          onClick={() => updateWatchedStatus(!watchedMovie)}
          title={watchedMovie ? "Mark as unwatched" : "Mark as watched"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-4 h-4 ${watchedMovie ? "text-white" : "text-gray-500"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </button>


        {/* Poster */}
        <div className="relative w-full aspect-[2/3]">
          {movie.poster ? (
            <Image
              src={movie.poster}
              alt={movie.title || "Movie poster"}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500">
              No poster
            </div>
          )}
        </div>

        {/* Title + Rating */}
        <div className="p-3 flex flex-col items-center text-center">
          <h3 className="text-lg font-semibold text-gray-100 line-clamp-2 h-14">
            {movie.title}
          </h3>


          {movie.year && (
            <p className="text-gray-400 text-sm">{movie.year}</p>
          )}

          {ratingMovie !== null ? (
            <p
              className="mt-2 text-yellow-400 font-medium cursor-pointer"
              onClick={updateRating}
            >
              ⭐ {ratingMovie}/10
            </p>
          ) : (
            <p
              className="mt-2 text-gray-400 text-sm cursor-pointer"
              onClick={updateRating}
            >
              ⭐ Rate
            </p>
          )}
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

  // ------------------------ GRID + LIST VIEW ---------------------------------

  return (
    <div
      className="relative flex flex-row rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
      style={
        view === "grid"
          ? {
            backgroundImage: `url('${movie.poster}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }
          : { backgroundColor: "#111827" }
      }
    >

      {view === "grid" && (
        <div className="absolute inset-0 bg-black/85" aria-hidden="true"></div>
      )}

      {/* Critic */}
      {movie.critic && (
        <span className="absolute top-0 left-0 z-20 bg-red-200 text-red-900 text-sm font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
          🍅 {movie.critic}
        </span>
      )}

      {/* Poster (LIST only) */}
      {movie.poster && view === "list" ? (
        <div className="w-1/6 shrink-0 flex items-start justify-center m-2 rounded-xl">
          <div className="relative w-full aspect-2/3 rounded-xl">
            <Image
              src={movie.poster}
              alt={movie.title || "Movie poster"}
              fill
              className="rounded-xl object-contain"
              unoptimized
            />
          </div>
        </div>
      ) : view === "list" ? (
        <div className="w-1/6 flex items-center justify-center bg-gray-800 text-gray-500 text-sm aspect-2/3">
          No poster
        </div>
      ) : null}

      {/* Content */}
      <div
        className={`flex flex-col justify-between p-6 relative ${view === "grid" ? "w-full" : "w-5/6"
          }`}
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">
            {movie.title || "Untitled"}
          </h2>

          {movie.year && (
            <p className="text-gray-400 text-lg mb-4">{movie.year}</p>
          )}

          {movie.summary && (
            <p className="text-gray-300 mb-4 line-clamp-4">
              {movie.summary}
            </p>
          )}
        </div>

        {/* Footer */}
        <div
          className={`flex items-center justify-between text-sm mt-4 ${view === "grid" ? "flex-col items-start gap-3" : ""
            }`}
        >
          <div className="flex flex-col sm:flex-row items-left gap-3">

            {/* Watched */}
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer ${watchedMovie
                ? "bg-green-900 text-green-300"
                : "bg-yellow-900 text-yellow-300"
                }`}
              onClick={() => updateWatchedStatus(!watchedMovie)}
            >
              {watchedMovie ? "Watched" : "To Watch"}
            </span>

            {/* Rating */}
            {ratingMovie !== null ? (
              <span
                className="flex items-center gap-1 text-yellow-400 cursor-pointer"
                onClick={updateRating}
              >
                ⭐ {ratingMovie}/10
              </span>
            ) : (
              <span
                className="px-3 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-400 cursor-pointer"
                onClick={updateRating}
              >
                ⭐ Rate Movie
              </span>
            )}

            {/* Availability */}
            {requestList.includes(movie.id) ? (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-500 text-white">
                <span className="loader"></span> Requesting...
              </span>
            ) : movie.available ? (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-600 text-green-100">
                Available on Plex
              </span>
            ) : requestedMovie ? (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-500 text-white">
                Requested on Plex
              </span>
            ) : (
              <button
                className="px-3 py-1 rounded-full text-xs font-medium bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                onClick={() => requestMovie(movie.id)}
              >
                Request on Plex
              </button>
            )}
          </div>
        </div>

        {/* Comments */}
        <div>
          {commentsMovie ? (
            <p
              className={`italic py-3 text-gray-400 ${view === "list" ? "max-w-[50%]" : "max-w-full"
                } cursor-pointer mt-2`}
              title={commentsMovie}
              onClick={updateComments}
            >
              “{commentsMovie}”
            </p>
          ) : (
            <p
              className="px-3 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-400 cursor-pointer mt-2 w-30 text-center"
              onClick={updateComments}
            >
              Add Comment
            </p>
          )}
        </div>
      </div>

      {/* {requesting && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-70 text-white">
          <p className="text-lg font-semibold mb-2">Requesting...</p>
          <p className="text-sm">Please wait</p>
        </div>
      )} */}
    </div>
  );
}
